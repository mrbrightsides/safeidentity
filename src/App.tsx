/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Play, 
  Activity, 
  Layers, 
  Info,
  ChevronRight,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { simulateConsensus, type ConsensusResult, type ValidatorResponse } from './services/genlayerService';

const DEFAULT_CONTRACT = `# SafeIdentity Intelligent Validator
# Logic: AI-Powered Decentralized Identity Validation

result = AI.evaluate(input)

# Threshold: Validity > 0.8 and Confidence > 0.85
if result["validity_score"] > 0.8 and result["confidence"] > 0.85:
    return "APPROVE"
elif result["risk_flag"] == True:
    return "REJECT"
else:
    return "DISPUTE"`;

const DEFAULT_INPUT = `{
  "claimant": "Alice Bradbury",
  "identityType": "Digital Resident",
  "metadata": {
    "issuedBy": "Bradbury Governance",
    "issueDate": "2025-01-15",
    "reputationScore": 92
  },
  "evidence": {
    "biometricHash": "0x7a...f2",
    "socialProof": "Verified via X/GitHub",
    "lastActivity": "2026-03-20"
  }
}`;

const CONFLICT_INPUT = `{
  "claimant": "Unknown Entity",
  "identityType": "Digital Resident",
  "metadata": {
    "issuedBy": "Shadow Network",
    "issueDate": "2026-03-25",
    "reputationScore": 12
  },
  "evidence": {
    "biometricHash": "0x00...00",
    "socialProof": "None",
    "lastActivity": "2026-03-26",
    "anomaly": "IP spoofing detected"
  }
}`;

export default function App() {
  const [contract, setContract] = useState(DEFAULT_CONTRACT);
  const [inputData, setInputData] = useState(DEFAULT_INPUT);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<ConsensusResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'consensus' | 'docs'>('editor');
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Portal initialized.", "[SYSTEM] Connected to Bradbury Testnet Simulator."]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    addLog("Initiating Optimistic Democracy consensus...");
    
    try {
      const consensusResult = await simulateConsensus(contract, inputData);
      setResult(consensusResult);
      addLog(`Consensus reached: ${consensusResult.finalDecision}`);
      
      // Check for conflict
      const hasConflict = consensusResult.validators && consensusResult.validators.length > 0 && 
        consensusResult.validators.some(v => v.vote !== consensusResult.validators[0].vote);
      
      if (hasConflict) {
        addLog("Conflict Detected: Consensus reached despite validator disagreement.");
      }
      
      setActiveTab('consensus');
    } catch (error: any) {
      addLog(`ERROR: ${error.message || "Consensus failed. Check API key."}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
            <Layers className="text-accent w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Safe<span className="text-accent">Identity</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">AI Decentralized Validator</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-border">
          {(['editor', 'consensus', 'docs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                activeTab === tab ? "bg-accent text-bg glow-accent" : "text-white/60 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-md">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono text-accent">TESTNET-BRADBURY-ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Sidebar - Logs & Info */}
        <aside className="lg:col-span-3 border-r border-border bg-card/30 p-4 flex flex-col gap-4 overflow-y-auto">
          <section className="glass-panel p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white/60 uppercase flex items-center gap-2">
              <Activity className="w-3 h-3 text-accent" /> Network Status
            </h3>
            <div className="space-y-2">
              <StatusItem label="Consensus" value="Optimistic Democracy" />
              <StatusItem label="Validators" value="AI-Driven (LLM)" />
              <StatusItem label="Epoch" value="4,291" />
              <StatusItem label="TPS" value="12.4" />
              {result?.validators && result.validators.length > 0 && result.validators.some(v => v.vote !== result.validators[0].vote) && (
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                  <span className="text-[10px] text-yellow-500 uppercase tracking-wider font-bold">Conflict Status</span>
                  <span className="text-[11px] font-mono text-yellow-500 animate-pulse">DETECTED</span>
                </div>
              )}
            </div>
          </section>

          <section className="flex-1 glass-panel p-4 flex flex-col gap-3 min-h-[300px]">
            <h3 className="text-xs font-bold text-white/60 uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3 text-accent" /> Node Logs
            </h3>
            <div className="flex-1 font-mono text-[10px] text-accent/80 space-y-1 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="border-l border-accent/20 pl-2 py-0.5">
                  {log}
                </div>
              ))}
              {result?.validators && result.validators.length > 0 && result.validators.some(v => v.vote !== result.validators[0].vote) && (
                <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Conflict Detected: Consensus reached despite validator disagreement
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Code2 className="text-accent" /> Intelligent Contract
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setContract(DEFAULT_CONTRACT);
                          setInputData(DEFAULT_INPUT);
                          addLog("Standard scenario loaded.");
                        }}
                        className={cn(
                          "text-[10px] border border-white/10 px-3 py-1 rounded transition-all",
                          inputData === DEFAULT_INPUT ? "bg-accent/20 text-accent border-accent/30" : "text-white/60 hover:bg-white/5"
                        )}
                      >
                        Standard Case
                      </button>
                      <button 
                        onClick={() => {
                          setContract(DEFAULT_CONTRACT);
                          setInputData(CONFLICT_INPUT);
                          addLog("Conflict scenario loaded.");
                        }}
                        className={cn(
                          "text-[10px] border border-white/10 px-3 py-1 rounded transition-all",
                          inputData === CONFLICT_INPUT ? "bg-red-500/20 text-red-500 border-red-500/30" : "text-white/60 hover:bg-white/5"
                        )}
                      >
                        Conflict Case
                      </button>
                      <button 
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="flex items-center gap-2 bg-accent text-bg px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 glow-accent"
                      >
                        {isSimulating ? <Activity className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isSimulating ? "Run Consensus" : "Run Consensus"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 glass-panel overflow-hidden flex flex-col">
                    <div className="bg-black/40 px-4 py-2 border-b border-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/40">safe_identity.py</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent/50" />
                        <span className="text-[9px] text-accent/70 uppercase font-bold">AI-Enabled</span>
                      </div>
                    </div>
                    <textarea
                      value={contract}
                      onChange={(e) => setContract(e.target.value)}
                      className="flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none text-accent/90"
                      spellCheck={false}
                    />
                  </div>

                  {/* Demo Guide */}
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg space-y-3">
                    <div>
                      <h4 className="text-[10px] font-bold text-accent uppercase mb-2 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Demo Scenario
                      </h4>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        {inputData === DEFAULT_INPUT 
                          ? "A user submits an identity claim (Alice Bradbury) → 3 AI validators analyze data consistency and fraud patterns → results vary slightly → consensus is reached → identity approved."
                          : "User submits a suspicious identity claim → AI validators detect anomalies (IP spoofing, low reputation) → Nodes disagree or provide low scores → Consensus REJECT/FLAGGED."
                        }
                        <br />
                        <span className="text-accent/60 mt-1 block italic">All AI outputs are structured and deterministic to ensure consistent consensus across validators.</span>
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-accent/10 space-y-2">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                        <p className="text-[9px] text-white/40 italic">
                          "Consensus is reached optimistically unless challenged by conflicting validator outputs."
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                        <p className="text-[9px] text-white/40 italic">
                          "All AI outputs are structured and deterministic to ensure consistent consensus across validators."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-accent" /> Transaction Input
                  </h2>
                  <div className="flex-1 glass-panel overflow-hidden flex flex-col">
                    <div className="bg-black/40 px-4 py-2 border-b border-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/40">transaction_data.json</span>
                    </div>
                    <textarea
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      className="flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none text-white/80"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'consensus' && (
              <motion.div 
                key="consensus"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex flex-col gap-6"
              >
                {(() => {
                  const hasConflict = result?.validators && result.validators.length > 0 && 
                    result.validators.some(v => v.vote !== result.validators[0].vote);
                  
                  return !result && !isSimulating ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
                      <AlertCircle className="w-16 h-16 text-white/20" />
                      <div>
                        <h3 className="text-xl font-bold">No Consensus Data</h3>
                        <p className="text-white/40">Run a simulation from the Editor tab to see results.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('editor')}
                        className="text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/10 transition-all"
                      >
                        Go to Editor
                      </button>
                    </div>
                  ) : isSimulating ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
                      <div className="relative">
                        <div className="w-24 h-24 border-4 border-accent/20 rounded-full animate-spin border-t-accent" />
                        <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold animate-pulse">AI Nodes Deliberating</h3>
                        <p className="text-white/40 font-mono text-sm mt-2">Reaching Optimistic Democracy Consensus...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={cn(
                          "md:col-span-2 glass-panel p-6 flex flex-col gap-4",
                          result?.finalDecision === 'APPROVE' ? "border-accent/50 bg-accent/5" : 
                          result?.finalDecision === 'DISPUTE' ? "border-yellow-500/50 bg-yellow-500/5" :
                          "border-red-500/50 bg-red-500/5"
                        )}>
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                              {result?.finalDecision === 'APPROVE' ? (
                                <><CheckCircle2 className="text-accent w-8 h-8" /> Identity Approved</>
                              ) : result?.finalDecision === 'DISPUTE' ? (
                                <><AlertCircle className="text-yellow-500 w-8 h-8" /> Flagged for Dispute</>
                              ) : (
                                <><XCircle className="text-red-500 w-8 h-8" /> Identity Rejected</>
                              )}
                            </h2>
                            <div className="px-3 py-1 rounded bg-black/40 border border-white/10 text-[10px] font-mono">
                              {hasConflict ? (
                                <span className="text-yellow-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> CONFLICT DETECTED
                                </span>
                              ) : (
                                'QUORUM REACHED'
                              )}
                            </div>
                          </div>
                          <p className="text-lg text-white/80 leading-relaxed italic">
                            "{result?.summary}"
                          </p>
                          {hasConflict && (
                            <div className="flex items-center gap-2 mt-2 py-1 px-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md w-fit">
                              <AlertCircle className="w-3 h-3 text-yellow-500" />
                              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">
                                Consensus reached despite validator disagreement
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="glass-panel p-6 flex flex-col gap-4">
                          <h3 className="text-xs font-bold text-white/60 uppercase">Confidence Metrics</h3>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={result?.validators} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="nodeId" stroke="#666" fontSize={10} />
                                <YAxis hide domain={[0, 1]} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                                  itemStyle={{ color: '#00ff9d' }}
                                  formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                                />
                                <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                                  {result?.validators.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.vote === 'APPROVE' ? '#00ff9d' : '#ef4444'} />
                                  ))}
                                  <LabelList 
                                    dataKey="confidence" 
                                    position="top" 
                                    formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                                    style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result?.validators.map((validator, i) => (
                          <ValidatorCard 
                            key={i} 
                            validator={validator} 
                            allValidators={result.validators}
                            isConflicting={hasConflict && validator.vote !== result.finalDecision}
                          />
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {activeTab === 'docs' && (
              <motion.div 
                key="docs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-8 prose prose-invert max-w-none"
              >
                <h1 className="text-accent">SafeIdentity</h1>
                <p className="text-xl text-white/60">AI-Powered Decentralized Identity Validator</p>
                
                <div className="mt-8 space-y-8 not-prose">
                  <section>
                    <h2 className="text-lg font-bold text-accent flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5" /> 🌍 Problem
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                      In the digital age, identity is the foundation of trust — yet identity verification remains centralized, vulnerable to manipulation, and difficult to verify across platforms. In Web3, the question is: <span className="text-white italic">“How can we trust an identity without a central authority?”</span>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-accent flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5" /> 💡 Solution
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                      SafeIdentity introduces Intelligent Contracts that use AI to help validate identity claims in a decentralized manner. We combine <span className="font-bold text-white">🤖 AI + 🧑‍🤝‍🧑 Consensus</span> for smarter verification.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-accent flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5" /> ⚙️ How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-2">1. Identity Claim</h4>
                        <p className="text-xs text-white/50">User submits name, metadata, optional evidence, and identity claims to the network.</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-2">2. AI Evaluation</h4>
                        <p className="text-xs text-white/50">Each validator node runs an LLM to analyze data consistency and fraud patterns.</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-2">3. Consensus</h4>
                        <p className="text-xs text-white/50">Optimistic Democracy: If the majority agrees → APPROVE. Conflicts can be challenged.</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-2">4. Final Decision</h4>
                        <p className="text-xs text-white/50">The smart contract finalizes the decision: Approve, Reject, or Flag for Dispute.</p>
                      </div>
                    </div>
                  </section>

                  <section className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
                    <h2 className="text-lg font-bold text-accent flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5" /> 🧩 Why Bradbury?
                    </h2>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li><span className="font-bold text-white">✓ Optimistic Democracy:</span> Multi-node AI validation with majority-based decision.</li>
                      <li><span className="font-bold text-white">✓ Equivalence Principle:</span> All AI outputs are structured and deterministic to ensure consistent consensus across validators.</li>
                      <li><span className="font-bold text-white">✓ Real-World Use Case:</span> Lightweight KYC, account verification, and digital trust scoring.</li>
                    </ul>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-border bg-card/50 flex items-center justify-between px-6 text-[10px] text-white/40 font-mono">
        <div>GENLAYER_SDK_V0.1.0-ALPHA</div>
        <div className="flex gap-4">
          <span>LATENCY: 42MS</span>
          <span>BLOCK: #821,092</span>
          <span className="text-accent">CONNECTED</span>
        </div>
      </footer>
    </div>
  );
}

function StatusItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-mono text-white/80">{value}</span>
    </div>
  );
}

function ValidatorCard({ validator, allValidators, isConflicting }: { validator: any, allValidators: any[], isConflicting?: boolean }) {
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const [showDetailedReasoning, setShowDetailedReasoning] = useState(false);

  const riskAnalysis: Record<string, string> = {
    low: "The AI analysis confirms high data consistency. Biometric hashes and social proof align with the claimed identity, indicating a legitimate user with no suspicious behavioral patterns.",
    medium: "The AI detected minor discrepancies, such as a mismatch between the reported location and the IP address, or a relatively new account age. This level suggests caution and potential manual review.",
    high: "AI evaluation flagged critical anomalies: IP spoofing, known 'Shadow Network' origin, or extremely low reputation scores. These patterns are strongly indicative of identity fraud or automated bot activity."
  };

  return (
    <div className={cn(
      "glass-panel p-4 flex flex-col gap-3 border-l-4 transition-all relative overflow-hidden",
      isConflicting 
        ? "border-l-yellow-500 border-2 bg-yellow-500/10 animate-pulse-border" 
        : "border-l-accent/30 hover:border-l-accent"
    )}>
      {isConflicting && (
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-yellow-500 text-bg text-[8px] font-bold uppercase tracking-tighter rounded-bl flex items-center gap-1">
          <AlertCircle className="w-2 h-2" /> Conflicting Node
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
            <Cpu className="w-3 h-3 text-accent" />
          </div>
          <span className="text-xs font-bold font-mono">{validator.nodeId}</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
          validator.vote === 'APPROVE' ? "bg-accent/20 text-accent" : "bg-red-500/20 text-red-500"
        )}>
          {validator.vote}
        </div>
      </div>
      
      {/* AI Evaluation Layer */}
      <div className="bg-black/40 p-2 rounded border border-white/5 space-y-2">
        <div className="flex justify-between text-[9px] uppercase tracking-wider text-white/40">
          <span>Validity Score</span>
          <span className="text-accent">{validator.aiEvaluation?.validity_score || 0}</span>
        </div>
        <div className="flex justify-between text-[9px] uppercase tracking-wider text-white/40">
          <span>Risk Flag</span>
          <span className={cn(
            validator.aiEvaluation?.risk_flag ? "text-red-400" : "text-accent"
          )}>{validator.aiEvaluation?.risk_flag ? "TRUE" : "FALSE"}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-white/40">
          <span>Risk Level</span>
          <span className={cn(
            "font-bold",
            validator.aiEvaluation?.riskLevel?.toLowerCase() === 'high' ? "text-red-400" : 
            validator.aiEvaluation?.riskLevel?.toLowerCase() === 'medium' ? "text-yellow-400" : "text-accent"
          )}>
            {validator.aiEvaluation?.riskLevel}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] text-white/60 leading-relaxed italic">
          "{validator.reasoning}"
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setShowRiskAnalysis(!showRiskAnalysis)}
            className="text-[9px] text-yellow-500/60 hover:text-yellow-500 flex items-center gap-1 uppercase tracking-widest font-bold"
          >
            {showRiskAnalysis ? "Hide Risk Analysis" : "View Risk Analysis"}
            <ChevronRight className={cn("w-2 h-2 transition-transform", showRiskAnalysis && "rotate-90")} />
          </button>

          <AnimatePresence>
            {showRiskAnalysis && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-[10px] text-white/50 bg-yellow-500/5 p-2 rounded border border-yellow-500/10 leading-relaxed">
                  <div className="font-bold text-yellow-500/80 mb-1 uppercase text-[8px]">AI Risk Assessment:</div>
                  {riskAnalysis[validator.aiEvaluation?.riskLevel?.toLowerCase()] || "Risk assessment based on multi-factor AI analysis."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setShowDetailedReasoning(!showDetailedReasoning)}
            className="text-[9px] text-accent/60 hover:text-accent flex items-center gap-1 uppercase tracking-widest font-bold"
          >
            {showDetailedReasoning ? "Hide AI Interpretation" : "View AI Interpretation"}
            <ChevronRight className={cn("w-2 h-2 transition-transform", showDetailedReasoning && "rotate-90")} />
          </button>

          <AnimatePresence>
            {showDetailedReasoning && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-[10px] text-white/50 bg-accent/5 p-2 rounded border border-accent/10 leading-relaxed">
                  {validator.aiEvaluation?.reasoning || "No detailed interpretation available."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-white/30 uppercase">Confidence</span>
          <span className="text-[10px] font-mono text-accent">{(validator.confidence * 100).toFixed(0)}%</span>
        </div>
        
        {/* Confidence Comparison Sparkline */}
        <div className="flex-1 h-6 bg-black/20 rounded p-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={allValidators}>
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#00ff9d" 
                strokeWidth={1} 
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.nodeId === validator.nodeId) {
                    return <circle cx={cx} cy={cy} r={2} fill="#00ff9d" />;
                  }
                  return <circle cx={cx} cy={cy} r={1} fill="#ffffff20" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DocSection({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
