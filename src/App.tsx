import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Upload,
  Sparkles,
  Target,
  Zap,
  Copy,
  Check,
  Cpu,
  Lightbulb
} from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000/analysis' });

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [profileText, setProfileText] = useState('');
  const [oportunityDescription, setOportunityDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const PIX_CODE = "00020126580014BR.GOV.BCB.PIX0136ab770a83-f6a6-4f7f-a78d-a72d0534e0d45204000053039865802BR5923RAFAEL CAMARGO EPIFANIO6015BENTO GONCALVES6226052237n8MLDsVH91hg3qbIRGA363046D7F";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setProfileText('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      setLoading(true);
      const { data } = await api.post('/profile', formData);
      if (data.extractedText) setProfileText(data.extractedText);
    } catch (err) {
      alert('Erro ao extrair PDF. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!profileText || !oportunityDescription) return;
    try {
      setLoading(true);
      const { data } = await api.post('/generate', { profileText, oportunityDescription });
      const cleanedText = data.analysis.split('```json')[0].trim();
      setAnalysis(cleanedText);
    } catch (err) {
      alert('Erro na geração da análise.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans antialiased">
      <nav className="flex items-center px-8 py-5 bg-white/80 backdrop-blur-md border-b border-indigo-50 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative bg-slate-900 p-2 rounded-xl shadow-xl border border-white/10">
            <Cpu className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter text-slate-800 flex items-center gap-1">
              MATCH <span className="text-blue-600 italic uppercase">Pro</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Análise Profissional</span>
          </div>
        </div>
      </nav>

      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-50 animate-bounce">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 tracking-tight">
            Mapeando Perfil Estratégico...
          </h3>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">Aguarde a IA processar</p>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto p-10">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Análise de <span className="text-blue-600">Match</span> Profissional e Estratégico
          </h1>
          <p className="text-slate-500 text-lg mt-2 max-w-2xl font-medium">
            Entenda como o seu perfil está adequado em relação à vaga desejada e receba insights personalizados para potencializar sua carreira.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-10 items-start">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white border border-indigo-50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="space-y-4 mb-8">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Currículo (PDF)</label>
                <div className="relative group border-2 border-dashed border-indigo-100 rounded-2xl p-10 hover:border-violet-400 hover:bg-violet-50/30 transition-all cursor-pointer text-center">
                  <input type="file" accept="application/pdf" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="w-6 h-6 text-indigo-400 mx-auto mb-4 group-hover:text-violet-600 transition-colors" />
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{file ? file.name : 'Selecione seu currículo'}</p>
                </div>

                <div className="flex gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    <strong>Dica:</strong> Para um resultado superior, utilize o PDF gerado pelo LinkedIn (Acesse seu perfil: <em>Mais &gt; Salvar como PDF</em>).
                  </p>
                </div>

                {profileText && (
                  <div className="flex items-center gap-2 justify-center py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-in zoom-in">
                    <Check className="w-3 h-3" /> Documento processado
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Descrição da Vaga</label>
                <textarea
                  rows={10}
                  value={oportunityDescription}
                  onChange={(e) => setOportunityDescription(e.target.value)}
                  placeholder="Cole aqui os requisitos da oportunidade..."
                  className="w-full border border-indigo-50 bg-slate-50/50 rounded-2xl p-5 text-sm focus:bg-white outline-none transition-all resize-none shadow-inner"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !profileText || !oportunityDescription}
                className={`w-full mt-8 py-4 font-bold rounded-2xl transition-all uppercase text-xs tracking-widest shadow-xl
                  ${(loading || !profileText || !oportunityDescription)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-blue-100'
                  }`}
              >
                {loading ? 'Consultando IA...' : 'Gerar Relatório'}
              </button>

              <div className="mt-8 pt-8 border-t border-indigo-50/50">
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                      <Cpu className="text-white w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Match Pro Lab</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Suporte & Feedback</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Tem alguma dúvida técnica ou sugestão de melhoria? Nossa equipe de análise está pronta para ouvir você.
                  </p>
                  <a href="mailto:suporte@matchpro.ai" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                    Enviar E-mail
                  </a>
                </div>
                <p className="text-[9px] text-center text-slate-300 mt-4 font-medium uppercase tracking-[0.2em]">
                  © 2026 Match Pro AI • v1.0.4
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white border border-indigo-50 rounded-[2.5rem] min-h-[750px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden relative">
            <div className="p-8 border-b border-indigo-50 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Análise do Match</span>
              </div>
              {analysis && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysis);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600 shadow-sm active:scale-95 transition-all hover:bg-indigo-50"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Análise'}
                </button>
              )}
            </div>

            <div className="flex-1 p-12 overflow-y-auto">
              {!analysis ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-60">
                  <Target className="w-16 h-16 text-slate-200 mb-6" />
                  <h3 className="text-xl font-bold text-slate-400">Pronto para começar</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Insira os dados ao lado para receber sua mentoria via IA.</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <article className="prose prose-indigo max-w-none 
                    prose-headings:text-indigo-900 prose-headings:font-bold 
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-strong:text-violet-600 prose-strong:font-bold
                    prose-li:text-slate-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysis}
                    </ReactMarkdown>
                  </article>

                  <div className="mt-12 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm mb-6">
                      <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Acrescento em algo para você? Pague um ☕ para a IA.</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed font-medium">
                      Sem assinaturas, sem anúncios. Apenas um propósito de auxiliar quem precisa. Se a análise foi útil, contribua com qualquer valor (qualquer mesmo!).
                    </p>

                    <div className="mt-10 flex flex-col items-center">
                      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-indigo-50 mb-8">
                        <img
                          src="https://lh3.googleusercontent.com/d/1i8_rjF4f6iKMCXdh_MO1W5PaFuu7FcNO"
                          alt="QR Code PIX Rafael"
                          className="w-72 h-72 md:w-80 md:h-80 object-contain mx-auto"
                        />
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            "Sorte é o que acontece quando a preparação encontra a oportunidade." — Sêneca
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(PIX_CODE);
                          setPixCopied(true);
                          window.clarity?.("event", "pix_copy_click");
                          setTimeout(() => setPixCopied(false), 3000);
                        }}
                        className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold transition-all shadow-2xl active:scale-95 w-full max-w-xs justify-center ${pixCopied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                      >
                        {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {pixCopied ? 'Código QR copiado!' : 'Retribuir com PIX'}
                      </button>
                    </div>

                    <p className="mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                      Obrigado por manter esse projeto vivo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}