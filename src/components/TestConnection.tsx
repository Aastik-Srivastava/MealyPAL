import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function TestConnection() {
  const [status, setStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we can connect to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        setStatus(`Connected as: ${user?.email || 'Not logged in'}`);

        // Check if user_profiles table exists and get its structure
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);

        if (error) {
          if (error.code === '42P01') {
            setError('user_profiles table does not exist');
          } else {
            setError(`Error checking table: ${error.message}`);
          }
          return;
        }

        // Get table structure
        const { data: tableData, error: tableError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);

        if (tableError) {
          setError(`Error getting table structure: ${tableError.message}`);
          return;
        }

        setTableInfo(tableData);
        setStatus('Connection successful and table exists');
      } catch (err) {
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-4 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Supabase Connection Test</h2>
        <div className="space-y-2">
          <p className="text-sm font-medium">Status: {status}</p>
          {error && (
            <div className="bg-red-50 p-3 rounded text-red-700">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {tableInfo && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">Table Structure:</p>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(tableInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 