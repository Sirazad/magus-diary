import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { PartyDTO } from '../../types/Party';
import type { ParticipantDTO } from '../../types/Participant';
import './PartyList.css';

export const PartyList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyDescription, setNewPartyDescription] = useState('');
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const [showMembersForParty, setShowMembersForParty] = useState<number | null>(null);
  const [editingPartyId, setEditingPartyId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<number>>(new Set());
  const [memberSearchName, setMemberSearchName] = useState('');
  const [memberSearchType, setMemberSearchType] = useState('JK');

  // Fetch all parties
  const { data: parties, isLoading: partiesLoading, error: partiesError, refetch: refetchParties } = useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const response = await apiClient.get<PartyDTO[]>('/parties');
      return response.data;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Fetch all participants
  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const response = await apiClient.get<ParticipantDTO[]>('/participants');
      return response.data;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Create party mutation
  const createPartyMutation = useMutation({
    mutationFn: async (partyData: { name: string; description: string }) => {
      const response = await apiClient.post<PartyDTO>('/parties', partyData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      setNewPartyName('');
      setNewPartyDescription('');
      setIsCreating(false);
    },
  });

  // Delete party mutation
  const deletePartyMutation = useMutation({
    mutationFn: async (partyId: number) => {
      await apiClient.delete(`/parties/${partyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      setSelectedPartyId(null);
    },
  });

  // Add member to party mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({ partyId, participantId }: { partyId: number; participantId: number }) => {
      await apiClient.post(`/parties/${partyId}/members/${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      refetchParties();
      setSelectedMemberIds(new Set());
    },
  });

  // Remove member from party mutation
  const removeMemberMutation = useMutation({
    mutationFn: async ({ partyId, participantId }: { partyId: number; participantId: number }) => {
      await apiClient.delete(`/parties/${partyId}/members/${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });

  // Update party mutation
  const updatePartyMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: number; name: string; description: string }) => {
      const response = await apiClient.put<PartyDTO>(`/parties/${id}`, { name, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      setEditingPartyId(null);
      setEditName('');
      setEditDescription('');
    },
  });

  const handleCreateParty = async () => {
    if (newPartyName.trim()) {
      createPartyMutation.mutate({
        name: newPartyName,
        description: newPartyDescription,
      });
    }
  };

  const handleAddMembers = async () => {
    if (showMembersForParty && selectedMemberIds.size > 0) {
      for (const memberId of selectedMemberIds) {
        await addMemberMutation.mutateAsync({
          partyId: showMembersForParty,
          participantId: memberId,
        });
      }
    }
  };

  const handleRemoveMember = (partyId: number, participantId: number) => {
    removeMemberMutation.mutate({ partyId, participantId });
  };

  const handleMemberToggle = (participantId: number) => {
    const newSet = new Set(selectedMemberIds);
    if (newSet.has(participantId)) {
      newSet.delete(participantId);
    } else {
      newSet.add(participantId);
    }
    setSelectedMemberIds(newSet);
  };

  const handleStartEdit = (party: PartyDTO) => {
    setEditingPartyId(party.id);
    setEditName(party.name);
    setEditDescription(party.description || '');
  };

  const handleUpdateParty = () => {
    if (editingPartyId && editName.trim()) {
      updatePartyMutation.mutate({
        id: editingPartyId,
        name: editName,
        description: editDescription,
      });
    }
  };

  const handleDeleteParty = (party: PartyDTO) => {
    if (window.confirm(`Are you sure you want to delete party "${party.name}"?`)) {
      deletePartyMutation.mutate(party.id);
    }
  };

  const handleToggleMembers = (partyId: number) => {
    if (showMembersForParty === partyId) {
      setShowMembersForParty(null);
      setSelectedMemberIds(new Set());
      setMemberSearchName('');
      setMemberSearchType('JK');
    } else {
      setShowMembersForParty(partyId);
      setSelectedMemberIds(new Set());
      setMemberSearchName('');
      setMemberSearchType('JK');
    }
  };

  const selectedParty = parties?.find((p) => p.id === showMembersForParty);
  
  // Handle memberIds as either Set or Array (from JSON)
  const memberIdsSet = selectedParty?.memberIds 
    ? (selectedParty.memberIds instanceof Set 
        ? selectedParty.memberIds 
        : new Set(selectedParty.memberIds as any))
    : new Set<number>();
    
  const partyMembers = participants?.filter((p) => memberIdsSet.has(p.id)) || [];
  const availableMembers = participants?.filter((p) => !memberIdsSet.has(p.id)) || [];

  if (partiesLoading || participantsLoading) {
    return <div className="party-loading">Loading parties...</div>;
  }

  if (partiesError) {
    return <div className="party-error">Error loading parties</div>;
  }

  return (
    <div className="party-management">
      <div className="party-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>👥 Parti admin</h2>
          <button
            onClick={() => refetchParties()}
            className="btn btn-secondary"
            style={{ fontSize: 'var(--font-size-base)' }}
          >
            🔄 Frissítés
          </button>
        </div>
      </div>

      <div className="party-container">
        {/* Create Party Section */}
        <div className="party-section create-section">
          <h3>Parti létrehozása</h3>
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary"
            >
              + Új parti
            </button>
          ) : (
            <div className="create-form">
              <input
                type="text"
                placeholder="Parti neve"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                className="form-input"
              />
              <textarea
                placeholder="Leírás (opcionális)"
                value={newPartyDescription}
                onChange={(e) => setNewPartyDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
              <div className="form-actions">
                <button
                  onClick={handleCreateParty}
                  disabled={createPartyMutation.isPending}
                  className="btn btn-success"
                >
                  {createPartyMutation.isPending ? 'Létrehozás...' : 'Létrehoz'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewPartyName('');
                    setNewPartyDescription('');
                  }}
                  className="btn btn-secondary"
                >
                  Mégse
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Parties List */}
        <div className="party-section parties-list-section">
          <h3>Partik ({parties?.length || 0})</h3>
          {parties && parties.length > 0 ? (
            <div className="parties-list">
              {parties.map((party) => (
                <div key={party.id} className="party-item">
                  {editingPartyId === party.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-input"
                        placeholder="Parti neve"
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
                          onClick={handleUpdateParty}
                          disabled={updatePartyMutation.isPending}
                          className="btn btn-success btn-sm"
                        >
                          {updatePartyMutation.isPending ? 'Mentés...' : 'Mentés'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingPartyId(null);
                            setEditName('');
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
                      <div className="party-item-header">
                        <h4>{party.name}</h4>
                        <span className="member-count">
                          {party.memberIds instanceof Set 
                            ? party.memberIds.size 
                            : (party.memberIds as any)?.length || 0} tag
                        </span>
                      </div>
                      {party.description && (
                        <p className="party-description">{party.description}</p>
                      )}
                      
                      {/* Show member names when not expanded */}
                      {showMembersForParty !== party.id && (() => {
                        const memberIdsSet = party.memberIds instanceof Set 
                          ? party.memberIds 
                          : new Set(party.memberIds as any);
                        const members = participants?.filter(p => memberIdsSet.has(p.id)) || [];
                        return members.length > 0 && (
                          <p className="party-members-summary">
                            {members.map(m => m.name).join(', ')}
                          </p>
                        );
                      })()}
                      
                      <div className="party-item-actions">
                        <button
                          onClick={() => handleToggleMembers(party.id)}
                          className={`btn btn-secondary btn-sm ${showMembersForParty === party.id ? 'active' : ''}`}
                        >
                          {showMembersForParty === party.id ? 'Tagok elrejtése' : 'Tagok'}
                        </button>
                        <button
                          onClick={() => handleStartEdit(party)}
                          className="btn btn-icon btn-secondary btn-sm"
                          title="Módosítás"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteParty(party)}
                          disabled={deletePartyMutation.isPending}
                          className="btn btn-icon btn-danger-soft btn-sm"
                          title="Törlés"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Member Management - shows when button is active */}
                      {showMembersForParty === party.id && (
                        <div className="members-management">
                          {/* Current Members */}
                          <div className="members-subsection">
                            <h4>Jelenlegi tagok ({partyMembers?.length || 0})</h4>
                            {partyMembers && partyMembers.length > 0 ? (
                              <div className="members-list">
                                {partyMembers.map((member) => (
                                  <div key={member.id} className="member-item">
                                    <span className="member-name">{member.name}</span>
                                    <div className="member-item-actions">
                                      {member.type && <span className="member-type-text">{member.type}</span>}
                                      <button
                                        onClick={() => handleRemoveMember(party.id, member.id)}
                                        disabled={removeMemberMutation.isPending}
                                        className="btn btn-icon btn-danger-soft btn-sm"
                                        title="Töröl"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="empty-message">Nincs tag ebben a partiban</p>
                            )}
                          </div>

                          {/* Add Members */}
                          <div className="members-subsection">
                            <h4>Tag hozzáadása</h4>
                            {availableMembers && availableMembers.length > 0 ? (
                              <>
                                {/* Search filters for available members */}
                                <div className="search-filters" style={{ marginBottom: '1rem' }}>
                                  <input
                                    type="text"
                                    placeholder="Keresés név alapján..."
                                    value={memberSearchName}
                                    onChange={(e) => setMemberSearchName(e.target.value)}
                                    className="form-input"
                                    style={{ marginBottom: '0.5rem' }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Keresés típus alapján..."
                                    value={memberSearchType}
                                    onChange={(e) => setMemberSearchType(e.target.value)}
                                    className="form-input"
                                  />
                                </div>
                                <div className="available-members">
                                  {availableMembers
                                    .filter(member => {
                                      const nameMatch = memberSearchName.trim() === '' || 
                                        member.name.toLowerCase().includes(memberSearchName.toLowerCase());
                                      const typeMatch = memberSearchType.trim() === '' || 
                                        (member.type && member.type.toLowerCase().includes(memberSearchType.toLowerCase()));
                                      return nameMatch && typeMatch;
                                    })
                                    .map((member) => (
                                    <label key={member.id} className="member-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={selectedMemberIds.has(member.id)}
                                        onChange={() => handleMemberToggle(member.id)}
                                      />
                                      <span>{member.name}</span>
                                      {member.type && <span className="member-type-text">{member.type}</span>}
                                    </label>
                                  ))}
                                </div>
                                {selectedMemberIds.size > 0 && (
                                  <button
                                    onClick={handleAddMembers}
                                    disabled={addMemberMutation.isPending}
                                    className="btn btn-success"
                                  >
                                    {addMemberMutation.isPending
                                      ? 'Hozzáadás...'
                                      : `${selectedMemberIds.size} tag${selectedMemberIds.size > 1 ? 'ok' : ''} hozzáadása`}
                                  </button>
                                )}
                              </>
                            ) : (
                              <p className="empty-message">All participants are already members</p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No parties created yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyList;