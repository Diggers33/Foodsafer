import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Loader2, UserPlus, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { api, usersService } from '@/api';

interface Connection {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  location: string;
  mutualConnections: number;
  isConnected: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapConnection(u: any, isConnected: boolean = true): Connection {
  const avatar = u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${API_BASE}${u.avatar}`) : '';
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown';
  const company = u.userCompanies?.[0]?.company?.name || u.organization || '';

  return {
    id: u.id,
    name,
    role: u.jobTitle || u.role || '',
    organization: company,
    avatar,
    location: u.city || u.country || '',
    mutualConnections: u.mutualConnections || 0,
    isConnected,
  };
}

export function ConnectionsList({ onBack }: { onBack: () => void }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [suggested, setSuggested] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch user's connections
      const data = await api.get<any[]>('/queries/users/connections');
      const conns = Array.isArray(data) ? data.map(u => mapConnection(u, true)) : [];
      setConnections(conns);

      // Try to fetch pending connection requests
      try {
        const pendingData = await usersService.getPendingRequests();
        const pending = Array.isArray(pendingData) ? pendingData.map(u => mapConnection(u, false)) : [];
        setPendingRequests(pending);
      } catch {
        // Pending requests endpoint may not exist
      }

      // Try to fetch suggested connections
      try {
        const suggestedData = await api.get<any[]>('/queries/users/suggested');
        const sugg = Array.isArray(suggestedData) ? suggestedData.map(u => mapConnection(u, false)) : [];
        setSuggested(sugg);
      } catch {
        // Suggested connections endpoint may not exist
      }
    } catch (err) {
      console.error('Failed to load connections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (userId: string) => {
    setProcessingIds(prev => new Set(prev).add(userId));
    try {
      await usersService.acceptConnection(userId);
      // Move from pending to connections
      const acceptedUser = pendingRequests.find(p => p.id === userId);
      if (acceptedUser) {
        setPendingRequests(prev => prev.filter(p => p.id !== userId));
        setConnections(prev => [...prev, { ...acceptedUser, isConnected: true }]);
      }
    } catch (err) {
      console.error('Failed to accept connection:', err);
      alert('Failed to accept connection. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleDecline = async (userId: string) => {
    setProcessingIds(prev => new Set(prev).add(userId));
    try {
      await usersService.declineConnection(userId);
      setPendingRequests(prev => prev.filter(p => p.id !== userId));
    } catch (err) {
      console.error('Failed to decline connection:', err);
      alert('Failed to decline connection. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-[#212121]" />
              </button>
              <h1>Connections</h1>
            </div>
            <Badge variant="secondary" className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">
              {connections.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Pending Connection Requests */}
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3>Connection Requests</h3>
                  <Badge variant="secondary" className="bg-[#FFF3E0] text-[#FF9800]">
                    {pendingRequests.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <article
                      key={request.id}
                      className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-[#FF9800]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {request.avatar ? (
                            <img
                              src={request.avatar}
                              alt={request.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#2E7D32] text-white font-semibold">
                              {request.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="line-clamp-1 mb-0.5">{request.name}</h4>
                          <p className="text-sm text-[#757575] line-clamp-1 mb-1">{request.role}</p>
                          <p className="text-xs text-[#757575] line-clamp-1">{request.organization}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                          onClick={() => handleAccept(request.id)}
                          disabled={processingIds.has(request.id)}
                        >
                          {processingIds.has(request.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-[#D32F2F] text-[#D32F2F] hover:bg-red-50"
                          onClick={() => handleDecline(request.id)}
                          disabled={processingIds.has(request.id)}
                        >
                          {processingIds.has(request.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </>
                          )}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* My Connections */}
            <div className="mb-6">
              <h3 className="mb-3">My Connections</h3>
              {connections.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-[#757575] mx-auto mb-3" />
                  <p className="text-[#757575]">No connections yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <article
                      key={connection.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {connection.avatar ? (
                            <img
                              src={connection.avatar}
                              alt={connection.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#2E7D32] text-white font-semibold">
                              {connection.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="line-clamp-1 mb-0.5">{connection.name}</h4>
                          <p className="text-sm text-[#757575] line-clamp-1 mb-1">{connection.role}</p>
                          <p className="text-xs text-[#757575] line-clamp-1">{connection.organization}</p>
                          {connection.mutualConnections > 0 && (
                            <p className="text-xs text-[#2E7D32] mt-1">
                              {connection.mutualConnections} mutual connections
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#757575] text-[#757575] hover:bg-gray-50 flex-shrink-0"
                        >
                          Message
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Connections */}
            {suggested.length > 0 && (
              <div>
                <h3 className="mb-3">People You May Know</h3>
                <div className="space-y-3">
                  {suggested.map((connection) => (
                    <article
                      key={connection.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {connection.avatar ? (
                            <img
                              src={connection.avatar}
                              alt={connection.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#2E7D32] text-white font-semibold">
                              {connection.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="line-clamp-1 mb-0.5">{connection.name}</h4>
                          <p className="text-sm text-[#757575] line-clamp-1 mb-1">{connection.role}</p>
                          <p className="text-xs text-[#757575] line-clamp-1">{connection.organization}</p>
                          {connection.mutualConnections > 0 && (
                            <p className="text-xs text-[#2E7D32] mt-1">
                              {connection.mutualConnections} mutual connections
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex-shrink-0"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
