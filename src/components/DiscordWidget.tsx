import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Sparkles, ExternalLink, ShieldCheck, Hash, Radio } from 'lucide-react';

export const DiscordWidget: React.FC = () => {
  const [inviteUrl, setInviteUrl] = useState('https://discord.gg/SuYb8hrp8A');
  const [serverId, setServerId] = useState('1534522677086257393');
  const [onlineMembers, setOnlineMembers] = useState<number | null>(null);
  const [presenceCount, setPresenceCount] = useState<number | null>(null);
  const [showEmbedWidget, setShowEmbedWidget] = useState(false);

  useEffect(() => {
    const savedInvite = localStorage.getItem('quorlex_discord_invite');
    if (savedInvite) setInviteUrl(savedInvite);

    const savedServerId = localStorage.getItem('quorlex_discord_server_id');
    const targetServerId = savedServerId || '1534522677086257393';
    setServerId(targetServerId);

    // Fetch live widget data
    fetch(`https://discord.com/api/guilds/${targetServerId}/widget.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.presence_count !== undefined) {
          const online = data.presence_count;
          const total = data.members && data.members.length > 0 
            ? Math.max(data.members.length, online) 
            : online;
          setOnlineMembers(online);
          setPresenceCount(total);
        }
      })
      .catch(() => {
        setOnlineMembers(null);
        setPresenceCount(null);
      });
  }, []);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Text Content */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Discord Hub Community</span>
            </div>

            <h2 className="text-3xl font-black text-slate-100 tracking-tight">
              Join the Quorlex Discord Server
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Connect with Minecraft modders, server administrators, developers, and digital creators. Get instant support, report bugs, share custom builds, and access release notifications!
            </p>

            {/* Channels Showcase */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-indigo-300">
                <Hash className="w-3.5 h-3.5" />
                <span>mod-releases</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-indigo-300">
                <Hash className="w-3.5 h-3.5" />
                <span>dev-logs</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-indigo-300">
                <Hash className="w-3.5 h-3.5" />
                <span>server-support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Join Quorlex Discord Community</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                type="button"
                onClick={() => setShowEmbedWidget(!showEmbedWidget)}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 font-semibold text-xs transition-all"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>{showEmbedWidget ? 'Hide Live Widget' : 'View Live Server Widget'}</span>
              </button>
            </div>
          </div>

          {/* Discord Counter or Embedded Iframe Widget */}
          <div className="md:col-span-5 bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
            {showEmbedWidget ? (
              <div className="flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold text-indigo-300 font-mono">Live Discord Widget</span>
                  <button 
                    onClick={() => setShowEmbedWidget(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <iframe
                  src={`https://discord.com/widget?id=${serverId || '1534522677086257393'}&theme=dark`}
                  width="100%"
                  height="340"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="rounded-xl border border-slate-800 shadow-lg bg-transparent"
                  title="Discord Live Widget"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-slate-200">Server Status</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-2xl font-black text-indigo-400 font-mono">
                      {presenceCount !== null ? presenceCount.toLocaleString() : '--'}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium mt-0.5">Total Members</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {onlineMembers !== null ? onlineMembers.toLocaleString() : '--'}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium mt-0.5 font-mono">Active Online</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                  Moderated 24/7 by Quorlex Core Team • Instant updates pushed automatically
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

