import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PERFIL_REDIRECT } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import logoSenac from "@/assets/logo-senac.png";

export function LoginPage() {
  const [email, setEmail]           = useState("");
  const [senha, setSenha]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, senha);
      toast.success("Bem-vindo, " + data.nome + "!");
      navigate(PERFIL_REDIRECT[data.perfil] ?? "/login");
    } catch {
      toast.error("E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">

      {/* Lado esquerdo */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-[42%] bg-[#004587] flex-col justify-between p-12"
      >
        <img src={logoSenac} alt="Senac" className="w-32 h-auto object-contain brightness-0 invert" />

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Sistema de Horas<br />Complementares
          </h1>
          <p className="text-blue-200 text-lg">
            Gerencie suas atividades acadêmicas de forma simples e eficiente.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Credenciais de teste</p>
          <div className="space-y-2">
            {[
              { tipo: "Aluno",       email: "aluno@teste.com"     },
              { tipo: "Coordenador", email: "coordenador@teste.com" },
            ].map(c => (
              <button
                key={c.tipo}
                onClick={() => { setEmail(c.email); setSenha("123"); }}
                className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <p className="text-white text-xs font-semibold">{c.tipo}</p>
                <p className="text-blue-200 text-xs">{c.email}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lado direito */}
      <div className="flex-1 bg-slate-50 flex flex-col justify-center items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <img src={logoSenac} alt="Senac" className="h-10 mx-auto mb-3" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Entrar na conta</h2>
              <p className="text-slate-500 text-sm mt-1">Informe suas credenciais para acessar o sistema</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#004587] hover:bg-[#003566] text-white font-semibold rounded-lg text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Entrando...</> : "Entrar"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Senac. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
}