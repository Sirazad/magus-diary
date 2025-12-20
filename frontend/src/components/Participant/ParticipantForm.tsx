import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { ParticipantDTO } from '../../types/Participant';
import './ParticipantForm.css';

interface ParticipantFormProps {
  editingId: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  editingId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch participant if editing
  const { data: participant } = useQuery({
    queryKey: ['participant', editingId],
    queryFn: async () => {
      if (!editingId) return null;
      const response = await apiClient.get<ParticipantDTO>(`/participants/${editingId}`);
      return response.data;
    },
    enabled: !!editingId,
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        type: participant.type || '',
        description: participant.description || '',
      });
    }
  }, [participant]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingId) {
        return await apiClient.put(`/participants/${editingId}`, data);
      } else {
        return await apiClient.post('/participants', data);
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { general: 'An error occurred' });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <form className="participant-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter participant name"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={errors.type ? 'input-error' : ''}
        >
          <option value="">Select a type...</option>
          <option value="character">Character</option>
          <option value="npc">NPC</option>
          <option value="calendar">Calendar</option>
          <option value="other">Other</option>
        </select>
        {errors.type && <span className="error-message">{errors.type}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter participant description"
          rows={4}
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {errors.general && <div className="error-message general">{errors.general}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : editingId ? 'Update Participant' : 'Create Participant'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ParticipantForm;