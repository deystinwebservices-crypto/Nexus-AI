import React, { useState } from 'react';
import './App.css';
import { NexussLogo } from './NexussLogo';
import {
  AssistantMode,
  ChatMessage,
  Conversation,
  MODE_DESCRIPTIONS,
} from './types';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-welcome',
    title: 'Welcome to Nexuss Studio',
    pinned: true,
    mode: 'balanced',
    updatedAt: new Date().toISOString(),
    messages: [],
  },
];

const STARTER_PROMPTS = [
  {
    title: 'Summarize a strategy doc',
    prompt: 'Outline a 3-step launch plan for an independent consulting practice.',
  },
  {
    title: 'Tutor mode walkthrough',
    prompt: 'Explain how server-side API keys protect my Gemini quota.',
  },
  {
    title: 'Draft client deliverable',
    prompt: 'Write a concise project kickoff memo with milestones and risks.',
  },
];

export function App() {
  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS
  );
  const [activeId, setActiveId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<'all' | 'pinned'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draftInput, setDraftInput] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const visibleConversations = conversations.filter((c) => {
    const matchesSearch = c.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPin = filterTab === 'all' ? true : c.pinned;
    return matchesSearch && matchesPin;
  });

  const handleCreateConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      pinned: false,
      mode: activeConversation?.mode ?? 'balanced',
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setErrorNotice(null);
  };

  const handleTogglePin = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleDeleteConversation = (convId: string) => {
    const remaining = conversations.filter((c) => c.id !== convId);
    if (remaining.length === 0) {
      const fallback: Conversation = {
        id: `conv-${Date.now()}`,
        title: 'New Conversation',
        pinned: false,
        mode: 'balanced',
        messages: [],
        updatedAt: new Date().toISOString(),
      };
      setConversations([fallback]);
      setActiveId(fallback.id);
      return;
    }
    setConversations(remaining);
    if (activeId === convId) {
      setActiveId(remaining[0].id);
    }
  };

  const handleModeChange = (newMode: AssistantMode) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, mode: newMode } : c
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftInput.trim();
    if (!trimmed || !activeConversation) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextTitle =
      activeConversation.messages.length === 0 &&
      (activeConversation.title === 'New Conversation' ||
        activeConversation.title === 'Welcome to Nexuss Studio')
        ? trimmed.slice(0, 48)
        : activeConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              title: nextTitle,
              messages: [...c.messages, userMsg],
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setDraftInput('');

    // Honest Stage 1 state: never fake an AI response
    setErrorNotice(
      'AI backend not connected yet (Stage 1). Your message was added to the thread, and we will wire up the live Netlify Function + Gemini API in Stage 2.'
    );
  };

  return (
    <div className="nx-shell">
      {/* Tier 1: Command Rail */}
      <nav className="nx-rail" aria-label="Workspace Command Rail">
        <div className="nx-rail-top">
          <NexussLogo size={32} showWordmark={false} />
          <div className="nx-rail-divider" />
          <button
            type="button"
            className={`nx-rail-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? 'Hide Studio Menu' : 'Show Studio Menu'}
            aria-label="Toggle Conversations Drawer"
          >
            ☰
          </button>
          <button
            type="button"
            className="nx-rail-btn"
            onClick={handleCreateConversation}
            title="New Conversation"
            aria-label="New Conversation"
          >
            ＋
          </button>
        </div>

        <div className="nx-rail-bottom">
          <span
            className="nx-rail-btn"
            title="Stage 1: Local UI Ready"
            aria-label="Status Indicator"
          >
            ⚡
          </span>
        </div>
      </nav>

      {/* Tier 2: Collapsible Studio Drawer */}
      {sidebarOpen && (
        <aside className="nx-sidebar" aria-label="Conversations Menu">
          <div className="nx-sidebar-top">
            <div className="nx-sidebar-header">
              <NexussLogo size={26} showWordmark={true} />
              <span className="nx-stage-pill">Stage 1</span>
            </div>

            <button
              type="button"
              className="nx-new-chat-btn"
              onClick={handleCreateConversation}
            >
              <span>✦ New Thread</span>
              <kbd>New</kbd>
            </button>

            <input
              type="search"
              className="nx-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="nx-filter-tabs">
              <button
                type="button"
                className={`nx-filter-tab ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                All ({conversations.length})
              </button>
              <button
                type="button"
                className={`nx-filter-tab ${
                  filterTab === 'pinned' ? 'active' : ''
                }`}
                onClick={() => setFilterTab('pinned')}
              >
                ★ Pinned ({conversations.filter((c) => c.pinned).length})
              </button>
            </div>
          </div>

          <div className="nx-conv-list">
            {visibleConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  className={`nx-conv-item ${isSelected ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="nx-conv-title-btn"
                    onClick={() => {
                      setActiveId(conv.id);
                      setErrorNotice(null);
                    }}
                  >
                    {conv.pinned ? '★ ' : ''}
                    {conv.title}
                  </button>
                  <div className="nx-conv-actions">
                    <button
                      type="button"
                      className="nx-icon-action"
                      title={conv.pinned ? 'Unpin' : 'Pin'}
                      onClick={() => handleTogglePin(conv.id)}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      className="nx-icon-action"
                      title="Delete conversation"
                      onClick={() => handleDeleteConversation(conv.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="nx-sidebar-footer">
            <span>Personal Workspace</span>
            <span>$0 Free Tier</span>
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <main className="nx-main">
        <header className="nx-topbar">
          <div className="nx-topbar-left">
            {!sidebarOpen && (
              <button
                type="button"
                className="nx-rail-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open Sidebar"
              >
                ☰
              </button>
            )}
            <span className="nx-conv-heading">
              {activeConversation?.title ?? 'Nexuss Studio'}
            </span>
          </div>

          <div className="nx-mode-select-wrap">
            <label htmlFor="mode-select" className="nx-mode-label">
              Personality:
            </label>
            <select
              id="mode-select"
              className="nx-mode-select"
              value={activeConversation?.mode ?? 'balanced'}
              onChange={(e) =>
                handleModeChange(e.target.value as AssistantMode)
              }
            >
              {(Object.keys(MODE_DESCRIPTIONS) as AssistantMode[]).map((m) => (
                <option key={m} value={m}>
                  {MODE_DESCRIPTIONS[m].label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Honest Backend Connection Banner */}
        <div className="nx-status-banner" role="status">
          <span>
            <strong>Status:</strong> AI backend not connected yet (Stage 1
            Frontend Preview). No fake responses are generated.
          </span>
          <span>
            Mode:{' '}
            <strong>
              {
                MODE_DESCRIPTIONS[activeConversation?.mode ?? 'balanced']
                  .label
              }
            </strong>
          </span>
        </div>

        {/* Message Feed or Welcome State */}
        <div className="nx-feed">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="nx-welcome">
              <NexussLogo size={48} showWordmark={false} />
              <h1>Nexuss AI Workspace</h1>
              <p>
                {
                  MODE_DESCRIPTIONS[activeConversation?.mode ?? 'balanced']
                    .summary
                }
              </p>

              <div className="nx-starter-grid">
                {STARTER_PROMPTS.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="nx-starter-card"
                    onClick={() => setDraftInput(item.prompt)}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeConversation.messages.map((msg) => (
              <div key={msg.id} className={`nx-msg-row ${msg.role}`}>
                <div className="nx-msg-meta">
                  {msg.role === 'user' ? 'You' : 'Nexuss'}
                </div>
                <div className="nx-msg-bubble">{msg.content}</div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <div className="nx-composer-area">
          {errorNotice && (
            <div className="nx-error-alert" role="alert">
              <span>{errorNotice}</span>
              <button
                type="button"
                className="nx-icon-action"
                onClick={() => setErrorNotice(null)}
              >
                ✕
              </button>
            </div>
          )}

          <form className="nx-composer-form" onSubmit={handleSendMessage}>
            <textarea
              rows={2}
              className="nx-composer-textarea"
              placeholder="Message Nexuss... (Press Enter to send, Shift+Enter for new line)"
              value={draftInput}
              onChange={(e) => setDraftInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              className="nx-send-btn"
              disabled={!draftInput.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;