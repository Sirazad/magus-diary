import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { ParticipantDTO } from '../../types/Participant';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorAlert } from '../Common/ErrorAlert';
import './ParticipantList.css';

export const ParticipantList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');

  // Fetch all participants
  const { data: participants, isLoading, error, refetch } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const response = await apiClient.get<ParticipantDTO[]>('/participants');
      return response.data;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Create participant mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; type: string; description: string }) => {
      const response = await apiClient.post<ParticipantDTO>('/participants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      setNewName('');
      setNewType('');
      setNewDescription('');
      setIsCreating(false);
    },
  });

  // Update participant mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name, type, description }: { id: number; name: string; type: string; description: string }) => {
      const response = await apiClient.put<ParticipantDTO>(`/participants/${id}`, { name, type, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      setEditingId(null);
      setEditName('');
      setEditType('');
      setEditDescription('');
    },
  });

  // Delete participant mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/participants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });

  const handleCreate = () => {
    if (newName.trim()) {
      createMutation.mutate({
        name: newName,
        type: newType,
        description: newDescription,
      });
    }
  };

  const handleStartEdit = (participant: ParticipantDTO) => {
    setEditingId(participant.id);
    setEditName(participant.name);
    setEditType(participant.type || '');
    setEditDescription(participant.description || '');
  };

  const handleUpdate = () => {
    if (editingId && editName.trim()) {
      updateMutation.mutate({
        id: editingId,
        name: editName,
        type: editType,
        description: editDescription,
      });
    }
  };

  const handleDelete = (participant: ParticipantDTO) => {
    if (window.confirm(`Are you sure you want to delete "${participant.name}"?`)) {
      deleteMutation.mutate(participant.id);
    }
  };

  if (isLoading) return <LoadingSpinner message="Karakterek betöltése..." />;
  if (error) return (
    <ErrorAlert 
      message="Nem sikerült betölteni a karaktereket"
      onDismiss={() => refetch()}
    />
  );

  // Filter participants locally based on search criteria
  const filteredParticipants = participants?.filter(participant => {
    const nameMatch = searchName.trim() === '' || 
      participant.name.toLowerCase().includes(searchName.toLowerCase());
    const typeMatch = searchType.trim() === '' || 
      (participant.type && participant.type.toLowerCase().includes(searchType.toLowerCase()));
    return nameMatch && typeMatch;
  });

  return (
    <div className="participant-management">
      <div className="participant-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>👤 Karakterek</h2>
          <button
            onClick={() => refetch()}
            className="btn btn-secondary"
            style={{ fontSize: 'var(--font-size-base)' }}
          >
            🔄 Frissítés
          </button>
        </div>
      </div>

      <div className="participant-container">
        {/* Create Section */}
        <div className="participant-section create-section">
          <h3>Új karakter hozzáadás</h3>
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary"
            >
              + Új karakter
            </button>
          ) : (
            <div className="create-form">
              <input
                type="text"
                placeholder="Név"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Típus (opcionális)"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="form-input"
              />
              <textarea
                placeholder="Leírás (opcionális)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
              <div className="form-actions">
                <button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="btn btn-success"
                >
                  {createMutation.isPending ? 'Létrehozás...' : 'Létrehoz'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName('');
                    setNewType('');
                    setNewDescription('');
                  }}
                  className="btn btn-secondary"
                >
                  Mégse
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="participant-section participants-list-section">
          <h3>Karakterek ({participants?.length || 0})</h3>
          
          {/* Search Filters */}
          <div className="search-filters" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Keresés név alapján..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="form-input"
              style={{ marginBottom: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Keresés típus alapján..."
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="form-input"
            />
            {(searchName || searchType) && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                {filteredParticipants?.length} találat
              </div>
            )}
          </div>

          {(searchName || searchType) ? (
            filteredParticipants && filteredParticipants.length > 0 ? (
              <div className="participants-list">
                {filteredParticipants.map((participant) => (
                <div key={participant.id} className="participant-item">
                  {editingId === participant.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-input"
                        placeholder="Név"
                      />
                      <input
                        type="text"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="form-input"
                        placeholder="Típus"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="form-textarea"
                        placeholder="Leírás"
                        rows={2}
                      />
                      <div className="form-actions">
                        <button
                          onClick={handleUpdate}
                          disabled={updateMutation.isPending}
                          className="btn btn-success btn-sm"
                        >
                          {updateMutation.isPending ? 'Mentés...' : 'Mentés'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName('');
                            setEditType('');
                            setEditDescription('');
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Mégse
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="participant-item-content">
                        <div className="participant-item-main">
                          <h4>{participant.name}</h4>
                          {participant.description && (
                            <p className="participant-description">{participant.description}</p>
                          )}
                        </div>
                        <div className="participant-item-meta">
                          {participant.type && <span className="participant-type-text">{participant.type}</span>}
                          <div className="participant-item-actions">
                            <button
                              onClick={() => handleStartEdit(participant)}
                              className="btn btn-icon btn-secondary btn-sm"
                              title="Módosítás"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(participant)}
                              disabled={deleteMutation.isPending}
                              className="btn btn-icon btn-danger-soft btn-sm"
                              title="Törlés"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Nincs találat</p>
          )
        ) : (
          <p className="empty-message">Használd a keresőt karakterek megjelenítéséhez</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;