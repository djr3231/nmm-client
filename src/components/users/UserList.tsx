'use client';

import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { User } from '@/types';
import { useState } from 'react';
import { UserForm } from './UserForm';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border px-4 py-3 rounded bg-destructive/10 border-destructive text-destructive">
        Error loading users: {error.message}
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
        >
          Add User
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
            <h3 className="text-lg font-bold mb-4">Create User</h3>
            <UserForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <UserForm 
              user={editingUser} 
              onClose={() => setEditingUser(null)} 
            />
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Created At</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteUser.isPending}
                    className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                  >
                    {deleteUser.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}