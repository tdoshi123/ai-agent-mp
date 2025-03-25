import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from '../context/auth/AuthContext';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      get(ref(db, `users/${user.uid}/role`))
        .then((snapshot) => {
          setRole(snapshot.val());
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
          setLoading(false);
        });
    }
  }, [user]);

  return { role, loading };
}