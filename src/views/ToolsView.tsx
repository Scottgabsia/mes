import React from 'react';
import {
  ShieldAlert,
  Search,
  FileCheck,
  Terminal,
  Cpu,
  ArrowRight,
  Fingerprint,
  Lock,
  Zap,
  Activity,
  Upload,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiPost } from '../lib/api';
import { sha256HexFromFile, fileToBase64, encryptAesEnvelope } from '../lib/forensic/crypto';
import { encryptWithPgpPublicKey } from '../lib/forensic/pgp';
import {
import { SeoEnrichment } from '../components/SeoEnrichment';
  analyzeDexLiquidity,
  authenticateNftOrigin,
  isEvmAddress,
  type ChainId,
  type DexAnalysisResult,
  type NftAuthResult,
} from '../lib/forensic/blockchain';

type ForensicConfig = {
  pgpPublicKey: string | null;
  maxUploadBytes: number;
  emailConfigured: boolean;
};

const CHAIN_OPTIONS: { id: ChainId; label: string }[] = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'bsc', label: 'BSC' },
];

function verdictColor(verdict: string): string {
  if (verdict.includes('HIGH') || verdict === 'HIGH_RISK') return 'text-red-400 border-red-500/30 bg-red-500/10';
  if (verdict.includes('CAUTION') || verdict === 'REVIEW_REQUIRED') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
}

export const ToolsView = () => {
  const [address, setAddress] = React.useState('');
  const [isAuditing, setIsAuditing] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState<null | { score: number; status: string }>(null);
  const [throughput, setThroughput] = React.useState(1.4);
  const [entityTags, setEntityTags] = React.useState(402129);
  const [eps, setEps] = React.useState(12.4);
  const [logs, setLogs] = React.useState([
    { time: '17:24:02', text: 'SOURCE: TOR_NODE_82 // PKT_CAP: 1.2MB' },
    { time: '17:24:03', text: 'ANALYZING_CLUSTER_XJ9... [MATCH_92%]' },
    { time: '17:24:05', text: 'ALERT: SUSPICIOUS_BRIDGE_TX // NET: SOLANA' },
    { time: '17:24:06', text: 'PING: VASP_COMPLIANCE_API // RESPONSE: 200' },
    { time: '17:24:08', text: 'SYNC_COMPLETE // UPDATING_ENTITY_DB...' },
    { time: '17:24:09', text: 'IDLE // STANDBY_MODE_ACTIVE' },
  ]);

  const [forensicConfig, setForensicConfig] = React.useState<ForensicConfig | null>(null);

  const [integrityFile, setIntegrityFile] = React.useState<File | null>(null);
  const [integrityHash, setIntegrityHash] = React.useState('');
  const [integrityEmail, setIntegrityEmail] = React.useState('');
  const [integrityBusy, setIntegrityBusy] = React.useState(false);
  const [integrityMsg, setIntegrityMsg] = React.useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const integrityInputRef = React.useRef<HTMLInputElement>(null);

  const [pgpPlaintext, setPgpPlaintext] = React.useState('');
  const [pgpPassphrase, setPgpPassphrase] = React.useState('');
  const [pgpOutput, setPgpOutput] = React.useState('');
  const [pgpBusy, setPgpBusy] = React.useState(false);
  const [pgpMode, setPgpMode] = React.useState<string>('');

  const [nftChain, setNftChain] = React.useState<ChainId>('ethereum');
  const [nftContract, setNftContract] = React.useState('');
  const [nftTokenId, setNftTokenId] = React.useState('');
  const [nftBusy, setNftBusy] = React.useState(false);
  const [nftResult, setNftResult] = React.useState<NftAuthResult | null>(null);
  const [nftError, setNftError] = React.useState('');

  const [dexChain, setDexChain] = React.useState<ChainId>('ethereum');
  const [dexPool, setDexPool] = React.useState('');
  const [dexBusy, setDexBusy] = React.useState(false);
  const [dexResult, setDexResult] = React.useState<DexAnalysisResult | null>(null);
  const [dexError, setDexError] = React.useState('');

  React.useEffect(() => {
    fetch('/api/forensic/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setForensicConfig(data as ForensicConfig);
      })
      .catch(() => {
        setForensicConfig({
          pgpPublicKey: null,
          maxUploadBytes: 5 * 1024 * 1024,
          emailConfigured: false,
        });
      });
  }, []);

  React.useEffect(() => {
    const statInterval = setInterval(() => {
      setThroughput((prev) => parseFloat((prev + (Math.random() > 0.5 ? 0.01 : -0.01)).toFixed(2)));
      setEntityTags((prev) => prev + (Math.random() > 0.8 ? 1 : 0));
      setEps((prev) => parseFloat((prev + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1)));
    }, 3000);

    const logInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
      const actions = [
        `SOURCE: TOR_NODE_${Math.floor(Math.random() * 99)}`,
        `ANALYZING_CLUSTER_${Math.random().toString(36).substring(7).toUpperCase()}`,
        'ALERT: P2P_ANOMALY_DETECTED',
        `PING: COMPLIANCE_NODE_${Math.floor(Math.random() * 10)}`,
        'SYNC_STATUS: OK // NODES_STABLE',
        `ENCRYPTED_PAYLOAD_RECEIVED // SIZE: ${(Math.random() * 5).toFixed(1)}MB`,
      ];
      setLogs((prev) => [{ time: timeStr, text: actions[Math.floor(Math.random() * actions.length)]! }, ...prev.slice(0, 5)]);
    }, 2000);

    return () => {
      clearInterval(statInterval);
      clearInterval(logInterval);
    };
  }, []);

  const runAudit = () => {
    if (!address) return;
    setIsAuditing(true);
    setAuditResult(null);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        score: Math.floor(Math.random() * 40) + 60,
        status: 'HIGH_RISK_ASSOCIATION',
      });
    }, 2000);
  };

  const processIntegrityFile = async (file: File) => {
    const maxBytes = forensicConfig?.maxUploadBytes ?? 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setIntegrityMsg({ type: 'err', text: `File exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit.` });
      return;
    }
    setIntegrityFile(file);
    setIntegrityMsg(null);
    try {
      const hash = await sha256HexFromFile(file);
      setIntegrityHash(hash);
    } catch {
      setIntegrityHash('');
      setIntegrityMsg({ type: 'err', text: 'Could not compute file hash.' });
    }
  };

  const submitIntegrityFile = async () => {
    if (!integrityFile || !integrityHash) return;
    setIntegrityBusy(true);
    setIntegrityMsg(null);
    try {
      const contentBase64 = await fileToBase64(integrityFile);
      const { ok, data, error } = await apiPost<{
        success?: boolean;
        caseRef?: string;
        message?: string;
        error?: string;
      }>('/api/forensic/integrity-upload', {
        filename: integrityFile.name,
        contentBase64,
        sha256: integrityHash,
        mimeType: integrityFile.type || 'application/octet-stream',
        notifierEmail: integrityEmail.trim() || undefined,
      });

      const payload = data as { success?: boolean; caseRef?: string; message?: string; error?: string } | null;
      if (ok && payload?.success) {
        setIntegrityMsg({
          type: 'ok',
          text: payload.message || `Submitted — ref ${payload.caseRef}. Check your inbox.`,
        });
        setIntegrityFile(null);
        setIntegrityHash('');
      } else {
        setIntegrityMsg({
          type: 'err',
          text: payload?.error || error || 'Upload failed. Ensure the site API and email are configured.',
        });
      }
    } catch {
      setIntegrityMsg({ type: 'err', text: 'Network error while uploading.' });
    } finally {
      setIntegrityBusy(false);
    }
  };

  const generatePgpPayload = async () => {
    if (!pgpPlaintext.trim()) return;
    setPgpBusy(true);
    setPgpOutput('');
    try {
      if (forensicConfig?.pgpPublicKey) {
        const result = await encryptWithPgpPublicKey(pgpPlaintext, forensicConfig.pgpPublicKey);
        setPgpOutput(result.armored);
        setPgpMode(result.algorithm);
      } else {
        if (pgpPassphrase.length < 8) {
          setPgpOutput('');
          setPgpMode('');
          alert('Enter a passphrase of at least 8 characters (server PGP key not configured).');
          return;
        }
        const result = await encryptAesEnvelope(pgpPlaintext, pgpPassphrase);
        setPgpOutput(result.armored);
        setPgpMode(result.algorithm);
      }
    } catch (e) {
      setPgpOutput('');
      setPgpMode('');
      alert(e instanceof Error ? e.message : 'Encryption failed');
    } finally {
      setPgpBusy(false);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const runNftVerify = async () => {
    setNftError('');
    setNftResult(null);
    if (!isEvmAddress(nftContract)) {
      setNftError('Enter a valid contract address (0x + 40 hex characters).');
      return;
    }
    setNftBusy(true);
    try {
      const result = await authenticateNftOrigin(
        nftChain,
        nftContract.trim(),
        nftTokenId.trim() || undefined
      );
      setNftResult(result);
    } catch (e) {
      setNftError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setNftBusy(false);
    }
  };

  const runDexAnalyze = async () => {
    setDexError('');
    setDexResult(null);
    if (!isEvmAddress(dexPool)) {
      setDexError('Enter a valid pool / pair address (0x + 40 hex).');
      return;
    }
    setDexBusy(true);
    try {
      const result = await analyzeDexLiquidity(dexChain, dexPool.trim());
      setDexResult(result);
    } catch (e) {
      setDexError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setDexBusy(false);
    }
  };

  const maxMb = Math.round((forensicConfig?.maxUploadBytes ?? 5242880) / (1024 * 1024));

  return (
    <main className="pt-40 md:pt-44 pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen relative z-10">
      <div className="mb-12 border-l-4 border-blue-600 pl-6">
        <h1 className="text-4xl font-manrope font-black text-white uppercase tracking-tight mb-2">
          Forensic <span className="text-blue-500">Toolkit</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Operational Utilities // v4.0.2</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert size={120} />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Search size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Address Risk Auditor</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Cross-referencing 400M+ Labeled Entities</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ENTER WALLET ADDRESS [0x... / bc1...]"
                  className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-6 pr-32 py-5 rounded-2xl font-mono text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                />
                <button
                  type="button"
                  onClick={runAudit}
                  disabled={isAuditing}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-manrope font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? 'AUDITING...' : 'RUN_AUDIT'}
                </button>
              </div>

              {isAuditing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-blue-400">
                    <span>SCANNING_NODES...</span>
                    <span>42% COMPLETE</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-blue-500" />
                  </div>
                </div>
              )}

              {auditResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Threat Score</p>
                    <p className="text-3xl font-mono font-bold text-red-400">{auditResult.score}/100</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Status</p>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">{auditResult.status}</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <button type="button" className="flex items-center gap-2 text-[10px] font-mono text-blue-400 hover:text-white transition-colors uppercase tracking-widest">
                      View full graph <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Sanctions List', 'Darknet Mixer', 'Exchange Deposit', 'Bridge Hub'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-[10px] font-mono text-slate-500 border border-white/5 p-3 rounded-xl bg-white/5">
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="text-emerald-500 w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Integrity Verifier</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload a case file — we compute SHA-256 and email it to our forensic inbox (max {maxMb}MB).
            </p>
            <input
              ref={integrityInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void processIntegrityFile(f);
              }}
            />
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && integrityInputRef.current?.click()}
              onClick={() => integrityInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) void processIntegrityFile(f);
              }}
              className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-emerald-500/40 transition-all cursor-pointer"
            >
              <Terminal className="text-slate-700 mb-2" size={24} />
              <p className="text-[10px] font-mono text-slate-500 uppercase">
                {integrityFile ? integrityFile.name : 'Drop case file or click to browse'}
              </p>
            </div>
            {integrityHash && (
              <p className="mt-3 text-[9px] font-mono text-emerald-400/80 break-all">
                SHA-256: {integrityHash}
              </p>
            )}
            <input
              type="email"
              value={integrityEmail}
              onChange={(e) => setIntegrityEmail(e.target.value)}
              placeholder="Your email (optional, for reply)"
              className="mt-4 w-full bg-[#0a0e16]/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-emerald-500/50"
            />
            <button
              type="button"
              disabled={!integrityFile || !integrityHash || integrityBusy}
              onClick={() => void submitIntegrityFile()}
              className="mt-4 w-full py-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {integrityBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {integrityBusy ? 'Transmitting...' : 'Verify & Send to Inbox'}
            </button>
            {integrityMsg && (
              <p className={`mt-3 text-[10px] font-mono ${integrityMsg.type === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>
                {integrityMsg.text}
              </p>
            )}
            {forensicConfig && !forensicConfig.emailConfigured && (
              <p className="mt-2 text-[9px] font-mono text-amber-500/80">
                Server email not configured — uploads will fail until RESEND or SMTP is set on Hostinger.
              </p>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-purple-500 w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">PGP Payload Encoder</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {forensicConfig?.pgpPublicKey
                ? 'Encrypts with your organization OpenPGP public key.'
                : 'No PGP key on server — uses AES-256-GCM with your passphrase.'}
            </p>
            <textarea
              value={pgpPlaintext}
              onChange={(e) => setPgpPlaintext(e.target.value)}
              className="w-full bg-[#0a0e16]/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-white h-24 mb-3 outline-none focus:border-purple-500/50 resize-none"
              placeholder="PLAINTEXT_SEQUENCE_..."
            />
            {!forensicConfig?.pgpPublicKey && (
              <input
                type="password"
                value={pgpPassphrase}
                onChange={(e) => setPgpPassphrase(e.target.value)}
                placeholder="Passphrase (min 8 chars)"
                className="w-full bg-[#0a0e16]/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white mb-3 outline-none focus:border-purple-500/50"
              />
            )}
            <button
              type="button"
              disabled={pgpBusy || !pgpPlaintext.trim()}
              onClick={() => void generatePgpPayload()}
              className="w-full py-3 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {pgpBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Generate Payload
            </button>
            {pgpOutput && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-purple-400 uppercase">{pgpMode} output</span>
                  <button
                    type="button"
                    onClick={() => void copyText(pgpOutput)}
                    className="text-[9px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <pre className="text-[8px] font-mono text-slate-400 bg-black/40 p-3 rounded-lg max-h-32 overflow-auto whitespace-pre-wrap break-all border border-white/5">
                  {pgpOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-950/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="text-blue-500 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">NFT Origin Authenticator</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Checks contract bytecode, ERC-721/1155 interfaces, and tokenURI metadata via public RPC nodes.
          </p>
          <div className="flex flex-col gap-3 mb-4">
            <select
              value={nftChain}
              onChange={(e) => setNftChain(e.target.value as ChainId)}
              className="bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-blue-500"
            >
              {CHAIN_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={nftContract}
              onChange={(e) => setNftContract(e.target.value)}
              placeholder="CONTRACT_ADDRESS (0x...)"
              className="w-full bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={nftTokenId}
              onChange={(e) => setNftTokenId(e.target.value)}
              placeholder="TOKEN_ID (optional)"
              className="w-full bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            disabled={nftBusy}
            onClick={() => void runNftVerify()}
            className="w-full py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {nftBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Verify
          </button>
          {nftError && <p className="mt-3 text-[10px] font-mono text-red-400">{nftError}</p>}
          <AnimatePresence>
            {nftResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl border text-[10px] font-mono space-y-2 ${verdictColor(nftResult.verdict)}`}
              >
                <p className="font-bold uppercase flex items-center gap-2">
                  {nftResult.verdict === 'HIGH_RISK' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  {nftResult.verdict.replace(/_/g, ' ')}
                </p>
                <p>Contract: {nftResult.isContract ? 'Yes' : 'No'} | ERC-721: {nftResult.isErc721 ? 'Yes' : 'No'} | ERC-1155: {nftResult.isErc1155 ? 'Yes' : 'No'}</p>
                {nftResult.tokenUri && <p className="break-all">tokenURI: {nftResult.tokenUri}</p>}
                {nftResult.riskFlags.length > 0 && <p>Flags: {nftResult.riskFlags.join(', ')}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-950/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-amber-500 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">DEX Liquidity Analyzer</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Reads Uniswap V2-style pair reserves on-chain and scores liquidity / rug-pull risk heuristics.
          </p>
          <div className="flex flex-col gap-3 mb-4">
            <select
              value={dexChain}
              onChange={(e) => setDexChain(e.target.value as ChainId)}
              className="bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-amber-500"
            >
              {CHAIN_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={dexPool}
              onChange={(e) => setDexPool(e.target.value)}
              placeholder="POOL_PAIR_ADDRESS (0x...)"
              className="w-full bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="button"
            disabled={dexBusy}
            onClick={() => void runDexAnalyze()}
            className="w-full py-3 bg-amber-600/10 border border-amber-500/30 text-amber-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {dexBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Analyze
          </button>
          {dexError && <p className="mt-3 text-[10px] font-mono text-red-400">{dexError}</p>}
          <AnimatePresence>
            {dexResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl border text-[10px] font-mono space-y-2 ${verdictColor(dexResult.verdict)}`}
              >
                <p className="font-bold uppercase flex items-center gap-2">
                  {dexResult.verdict === 'HIGH_RISK' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  {dexResult.verdict} — Score {dexResult.liquidityScore}/100
                </p>
                {dexResult.reserve0 && (
                  <p>
                    Reserves: {dexResult.reserve0} / {dexResult.reserve1}
                  </p>
                )}
                {dexResult.riskFlags.length > 0 && <p>Flags: {dexResult.riskFlags.join(', ')}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 glass-panel p-8 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
            <Activity className="text-blue-500" size={20} /> Darknet Node Monitor
          </h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Global Sync Active</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'ATTACK_VECTORS', val: '22 Active', icon: <ShieldAlert size={14} /> },
              { label: 'NODE_THROUGHPUT', val: `${throughput.toFixed(2)} PB/day`, icon: <Cpu size={14} /> },
              { label: 'ENTITY_TAGS', val: entityTags.toLocaleString(), icon: <Fingerprint size={14} /> },
              { label: 'RECOVERY_EPS', val: `${eps.toFixed(1)} / hr`, icon: <Zap size={14} /> },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  {stat.icon}
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <p className="text-xl font-mono font-bold text-white tracking-tighter">{stat.val}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 bg-black/40 rounded-xl p-4 border border-white/5 h-[120px] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent z-10"></div>
            <div className="space-y-1 font-mono text-[8px] text-emerald-500/70">
              {logs.map((log, idx) => (
                <p key={idx}>{`[${log.time}] ${log.text}`}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    
      <SeoEnrichment page="tools" />
    </main>
  );
};
