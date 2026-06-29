import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockBots, mockThingsBoardUsers, mockDeviceTelemetry } from '../../utils/mockData';
import type { ThingsBoardUserMapping } from '../../types';

interface UserDraft {
  id: string | null;
  name: string;
  email: string;
  botId: string | null;
  deviceIds: string[];
}

const emptyDraft: UserDraft = { id: null, name: '', email: '', botId: null, deviceIds: [] };

export default function ThingsBoardSection() {
  const [users, setUsers] = useState<ThingsBoardUserMapping[]>(mockThingsBoardUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(mockThingsBoardUsers[0]?.id ?? null);
    const [draft, setDraft] = useState<UserDraft | null>(null);
  const [newDevice, setNewDevice] = useState('');

  // Load persisted users from the backend on mount.
  useEffect(() => {
    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((rows: ThingsBoardUserMapping[]) => {
        if (rows.length) {
          setUsers(rows);
          setSelectedUserId(rows[0].id);
        }
      })
      .catch(() => {
        // Backend not running — keep the mock data as a fallback.
      });
  }, []);

  const activeBots = mockBots.filter((b) => b.status === 'active');

  const totalUsers = users.length;
  const allDeviceIds = Array.from(new Set(users.flatMap((u) => u.deviceIds)));
  const liveCount = users.filter((u) => u.telemetryStatus === 'live').length;

  // Pool of device IDs the admin can pick from: known telemetry devices + any already assigned.
  const knownDevices = useMemo(
    () => Array.from(new Set([...Object.keys(mockDeviceTelemetry), ...users.flatMap((u) => u.deviceIds)])).sort(),
    [users]
  );

  const stats = [
    { label: 'Total Users', value: String(totalUsers), sub: `${users.filter((u) => u.botId).length} with bots assigned` },
    { label: 'Active Bots', value: String(activeBots.length), sub: 'Currently operational' },
    { label: 'IoT Devices', value: String(allDeviceIds.length), sub: `${liveCount} reporting live` },
    { label: 'Live Streams', value: String(liveCount), sub: 'telemetry active' },
  ];

  const getBotById = (botId: string | null) => mockBots.find((b) => b.botId === botId) ?? null;
  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;
  const selectedBot = selectedUser ? getBotById(selectedUser.botId) : null;

  const openAdd = () => {
    setDraft({ ...emptyDraft });
    setNewDevice('');
  };

  const openEdit = (u: ThingsBoardUserMapping) => {
    setDraft({ id: u.id, name: u.name, email: u.email, botId: u.botId, deviceIds: [...u.deviceIds] });
    setNewDevice('');
  };

  const closeEditor = () => {
    setDraft(null);
    setNewDevice('');
  };

  const toggleDraftDevice = (id: string) => {
    setDraft((d) =>
      d
        ? { ...d, deviceIds: d.deviceIds.includes(id) ? d.deviceIds.filter((x) => x !== id) : [...d.deviceIds, id] }
        : d
    );
  };

  const addCustomDevice = () => {
    const id = newDevice.trim();
    if (!id) return;
    setDraft((d) => (d && !d.deviceIds.includes(id) ? { ...d, deviceIds: [...d.deviceIds, id] } : d));
    setNewDevice('');
  };

    const deleteUser = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
    } catch {
      // ignore network error; still update the UI
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (selectedUserId === id) setSelectedUserId(null);
  };


    const saveDraft = async () => {
    if (!draft || !draft.name.trim() || !draft.email.trim()) return;

    if (draft.id) {
      // --- Edit existing user ---
      const existing = users.find((u) => u.id === draft.id);
      const telemetryStatus: ThingsBoardUserMapping['telemetryStatus'] =
        draft.deviceIds.length === 0
          ? 'none'
          : existing?.telemetryStatus === 'none'
          ? 'live'
          : existing?.telemetryStatus ?? 'live';

      const updated: ThingsBoardUserMapping = {
        id: draft.id,
        name: draft.name.trim(),
        email: draft.email.trim(),
        botId: draft.botId,
        deviceIds: draft.deviceIds,
        telemetryStatus,
      };

      try {
        await fetch(`/api/users/${draft.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch {
        // ignore network error; still update the UI
      }
      setUsers((prev) => prev.map((u) => (u.id === draft.id ? updated : u)));
    } else {
      // --- Add new user ---
      const newId = `u-${totalUsers + 1}-${draft.name.trim().toLowerCase().replace(/\s+/g, '-')}`;
      const newUser: ThingsBoardUserMapping = {
        id: newId,
        name: draft.name.trim(),
        email: draft.email.trim(),
        botId: draft.botId,
        deviceIds: draft.deviceIds,
        telemetryStatus: draft.deviceIds.length > 0 ? 'live' : 'none',
      };

      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
      } catch {
        // ignore network error; still update the UI
      }
      setUsers((prev) => [...prev, newUser]);
      setSelectedUserId(newId);
    }
    closeEditor();
  };

  const statAccentBars = ['bg-indigo-500', 'bg-purple-500', 'bg-sky-500', 'bg-emerald-500'];

  return (
    <div className="space-y-6">

      {/* ── Stats Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl shadow-sm p-5 overflow-hidden"
          >
            <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${statAccentBars[i % 4]}`} />
            <p className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {s.label}
            </p>
            <p className="pl-3 mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {s.value}
            </p>
            <p className="pl-3 mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Bot Legend ──────────────────────────────────────────── */}
      <Card title="Bot Legend">
        <div className="flex flex-wrap gap-3">
          {mockBots.map((bot) => (
            <div
              key={bot.botId}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
                bot.status === 'coming-soon'
                  ? 'border-zinc-200/60 dark:border-zinc-700/40 bg-zinc-50 dark:bg-zinc-800/30 opacity-50 italic'
                  : 'border-zinc-200/70 dark:border-zinc-700/50 bg-zinc-50/60 dark:bg-zinc-800/50'
              }`}
            >
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${bot.colorDot}`} />
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-none">{bot.botName}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{bot.botId}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── User Device Mapping Table ────────────────────────────── */}
      <Card className="overflow-x-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">User Device Mapping</h3>
          <Button variant="primary" onClick={openAdd}>+ Add User</Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-y border-zinc-200/80 dark:border-zinc-700/60 text-left">
              <th className="py-3 pl-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                User
              </th>
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Bot
              </th>
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Devices
              </th>
              <th className="py-3 pr-3 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {users.map((u) => {
              const bot = getBotById(u.botId);
              const isSelected = selectedUserId === u.id;
              const initials = u.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              return (
                <tr
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-500/10'
                      : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <td className="py-3.5 pl-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 select-none ${
                          isSelected
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                            : 'bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{u.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    {bot ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${bot.colorDot}`} /> {bot.botName}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.deviceIds.length === 0 ? (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">no devices</span>
                      ) : (
                        u.deviceIds.map((id) => <Badge key={id} label={id} color="blue" />)
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(u); }}
                        title="Edit"
                        className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }}
                        title="Delete"
                        className="p-1.5 rounded-md text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* ── Selected User — Bot & Devices Detail ────────────────── */}
      {selectedUser && (
        <Card title={`${selectedUser.name} — Assigned Bot & Devices`}>
          {selectedBot ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
              Assigned to{' '}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedBot.botName}</span>{' '}
              ({selectedBot.botId})
            </p>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">No bot assigned yet.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedUser.deviceIds.length === 0 && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">No devices linked to this user.</p>
            )}
            {selectedUser.deviceIds.map((id) => {
              const telemetry = mockDeviceTelemetry[id];
              const isOnline = telemetry?.status === 'online';
              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/50 rounded-lg px-4 py-3"
                >
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{id}</p>
                  <Badge label={isOnline ? 'Online' : 'Offline'} color={isOnline ? 'green' : 'gray'} />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Add / Edit User Modal ────────────────────────────────── */}
      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4"
          onClick={closeEditor}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/60 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              {draft.id ? 'Edit User' : 'Add User'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  User name
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Alice Chen"
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="e.g. alice@zigxo.io"
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Assign bot
                </label>
                <select
                  value={draft.botId ?? ''}
                  onChange={(e) => setDraft({ ...draft, botId: e.target.value || null })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                >
                  <option value="">No bot assigned</option>
                  {mockBots.map((b) => (
                    <option key={b.botId} value={b.botId} disabled={b.status === 'coming-soon'}>
                      {b.botName} ({b.botId}){b.status === 'coming-soon' ? ' — coming soon' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Assign devices
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 max-h-32 overflow-y-auto">
                  {knownDevices.map((id) => {
                    const checked = draft.deviceIds.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleDraftDevice(id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          checked
                            ? 'bg-indigo-500/10 dark:bg-indigo-400/10 border-indigo-400/50 text-indigo-600 dark:text-indigo-400'
                            : 'bg-white dark:bg-zinc-700 border-zinc-300/70 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-600'
                        }`}
                      >
                        {checked ? '✓ ' : ''}{id}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDevice}
                    onChange={(e) => setNewDevice(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomDevice(); } }}
                    placeholder="Add a device ID, e.g. DEV-1007"
                    className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                  />
                  <Button variant="secondary" type="button" onClick={addCustomDevice}>Add</Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <Button variant="ghost" onClick={closeEditor}>Cancel</Button>
              <Button
                variant="primary"
                onClick={saveDraft}
                disabled={!draft.name.trim() || !draft.email.trim()}
                className={!draft.name.trim() || !draft.email.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {draft.id ? 'Save changes' : 'Add user'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
