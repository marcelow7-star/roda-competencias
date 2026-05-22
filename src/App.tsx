import React, { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import "./styles.css";

const competencias = [
  "Comunicação",
  "Trabalho em equipe",
  "Liderança",
  "Criatividade",
  "Organização",
  "Tomada de decisão",
  "Resolução de problemas",
  "Gestão do tempo",
  "Visão estratégica",
  "Pensamento crítico",
  "Adaptabilidade",
  "Inteligência emocional",
];

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="kicker">{children}</div>;
}

function Header({ section }: { section: string }) {
  return (
    <div className="header">
      <div>
        <strong>Marcelo Wiethá</strong>
        <Kicker>Mentoria em sucessão e carreira</Kicker>
      </div>
      <Kicker>Relatório + Plano de Ação · {section}</Kicker>
    </div>
  );
}

export default function App() {
  const [tela, setTela] = useState<
  "inicio" | "resposta" | "relatorio" | "obrigado"
>("inicio");
  const [nome, setNome] = useState("");
  const [perfil, setPerfil] = useState("");
  const [notas, setNotas] = useState<Record<string, number>>(
    Object.fromEntries(competencias.map((c) => [c, 5]))
  );

  const dados = useMemo(
    () =>
      competencias.map((c) => ({
        competencia: c,
        competenciaRadar: c.replace(" ", "\n"),
        nota: notas[c] || 0,
      })),
    [notas]
  );

  const menoresCompetencias = [...dados]
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);

  if (tela === "inicio") {
    return (
      <div className="app">
        <section className="cover">
          <div className="cover-border">
            <div>
              <Kicker>Diagnóstico de competências</Kicker>
              <Kicker>Apresentação inicial</Kicker>
              <h1>Roda das Competências</h1>
              <p>
                Antes de iniciarmos, este diagnóstico tem como objetivo mapear
                suas competências profissionais atuais, para que possamos
                estruturar um plano de ação focado no seu desenvolvimento
                profissional.
              </p>
              <p>
                A partir das suas respostas, será possível identificar pontos de
                força, possíveis limitações e direcionar melhor o seu
                desenvolvimento.
              </p>
              <button className="primary" onClick={() => setTela("resposta")}>
                Iniciar diagnóstico
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (tela === "resposta") {
const enviarDados = async () => {
  await fetch("https://formspree.io/f/xjgzrwky", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      perfil,

      pontos_fortes: [...dados]
        .sort((a, b) => b.nota - a.nota)
        .slice(0, 3)
        .map((c) => c.competencia)
        .join(", "),

      pontos_de_atencao: menoresCompetencias
        .map((c) => c.competencia)
        .join(", "),

      respostas_formatadas: dados
        .map((item) => `${item.competencia}: ${item.nota}`)
        .join("\n"),
    }),
  });

  setTela("obrigado");
};
    return (
      <div className="app">
        <section className="page white">
          <Header section="Resposta" />
          <Kicker>Participante</Kicker>
          <h1>Dados do mentorando</h1>
          <div className="blue-line" />

          <div className="grid">
            <div>
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div>
              <label>Perfil do respondente</label>
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Conselheiro">Conselheiro</option>
                <option value="CEO">CEO</option>
                <option value="C-Level">C-Level</option>
                <option value="Gerente">Gerente</option>
                <option value="Empreendedor">Empreendedor</option>
              </select>
            </div>
          </div>

          <Kicker>Autoavaliação</Kicker>

          {competencias.map((c) => (
            <div className="slider" key={c}>
              <strong>{c}</strong>
              <span>{notas[c]}</span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={notas[c]}
                onChange={(e) =>
                  setNotas({ ...notas, [c]: Number(e.target.value) })
                }
              />
            </div>
          ))}

          <button className="primary" onClick={enviarDados}>
            Finalizar diagnóstico
          </button>
        </section>
      </div>
    );
  }

  if (tela === "relatorio") {
    const conclusaoExecutiva = () => {
      return "Este relatório apresenta uma leitura consolidada das competências avaliadas, destacando pontos fortes, oportunidades de desenvolvimento e prioridades para evolução profissional.";
    };

    const classificacaoPerfil = () => {
      const media =
        dados.reduce((soma, item) => soma + item.nota, 0) / dados.length;

      if (media >= 9) return "Perfil de Alta Performance";
      if (media >= 8) return "Perfil Forte e Consistente";
      if (media >= 5) return "Perfil em Desenvolvimento";
      return "Perfil com Prioridades Críticas";
    };

    const leituraPerfil = () => {
      const baixas = menoresCompetencias.map((c) => c.competencia);

      const altas = [...dados]
        .sort((a, b) => b.nota - a.nota)
        .slice(0, 3)
        .map((c) => c.competencia);

      const media =
        dados.reduce((soma, item) => soma + item.nota, 0) / dados.length;

      if (media >= 8.5) {
        return `Considerando o papel de ${
          perfil || "liderança avaliada"
        }, o radar demonstra um nível elevado e consistente nas competências avaliadas.

Destacam-se especialmente competências como ${altas.join(
          ", "
        )}, que podem ser utilizadas como alavancas estratégicas na atuação profissional.

O momento atual sugere foco na manutenção desse padrão de excelência, bem como na ampliação de impacto dessas competências em contextos mais complexos.`;
      }

      return `Considerando o papel de ${
        perfil || "liderança avaliada"
      }, observa-se que competências como ${baixas.join(
        ", "
      )} demandam maior atenção no momento.

Por outro lado, competências como ${altas.join(
        ", "
      )} se destacam como pontos de força, podendo ser alavancas importantes na atuação profissional.

O padrão apresentado no radar indica oportunidades claras de desenvolvimento estruturado.`;
    };

    return (
      <div className="app">
        <section className="page white">
          <Header section="Relatório" />
          <Kicker>Resultado</Kicker>

          <h1>Diagnóstico de Competências</h1>
          <div className="blue-line" />
          <div className="text-block">
  <strong>{classificacaoPerfil()}</strong>
</div>

          <div className="text-block">
            <strong>{classificacaoPerfil()}</strong>
          </div>

          <div className="diagnostic">
            <div className="text-block">
              <strong>Leitura do perfil</strong>
              <p>{leituraPerfil()}</p>
            </div>
            <div className="text-block">
  <strong>Pontos fortes</strong>
  <p>
    {[...dados]
      .sort((a, b) => b.nota - a.nota)
      .slice(0, 3)
      .map((c) => c.competencia)
      .join(", ")}
  </p>

  <strong>Pontos de atenção</strong>
  <p>{menoresCompetencias.map((c) => c.competencia).join(", ")}</p>
</div>

            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={dados}>
                  <PolarGrid />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar
                    dataKey="nota"
                    stroke="#4aa3ff"
                    fill="#4aa3ff"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>

              <ul className="legenda">
                {dados.map((item, i) => (
                  <li key={i}>
                    <strong>{item.competencia}</strong>: {item.nota}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="plano-acao">
            <h2>Plano de Ação Prioritário</h2>
            <ul>
              {menoresCompetencias.map((c, i) => {
                const nota =
                  dados.find((d) => d.competencia === c.competencia)?.nota || 0;

                let acaoBase = "";

                if (nota >= 9) {
                  acaoBase = `Para o perfil de ${
                    perfil || "liderança avaliada"
                  }, recomenda-se potencializar essa competência como diferencial de atuação, ampliando sua aplicação em contextos mais estratégicos e complexos.`;
                } else if (c.competencia === "Comunicação") {
                  acaoBase = `Para o perfil de ${
                    perfil || "liderança avaliada"
                  }, recomenda-se aprimorar clareza na comunicação, com foco em alinhamento de expectativas e feedback estruturado.`;
                } else if (c.competencia === "Liderança") {
                  acaoBase = `Para o perfil de ${
                    perfil || "liderança avaliada"
                  }, recomenda-se desenvolver liderança ativa, com delegação clara e acompanhamento da execução.`;
                } else if (c.competencia === "Trabalho em equipe") {
                  acaoBase = `Para o perfil de ${
                    perfil || "liderança avaliada"
                  }, recomenda-se fortalecer colaboração com o time, promovendo alinhamento e responsabilidade compartilhada.`;
                } else {
                  acaoBase = `Para o perfil de ${
                    perfil || "liderança avaliada"
                  }, recomenda-se desenvolver essa competência com ações práticas e acompanhamento contínuo.`;
                }

                let complemento = "";

                if (nota <= 4) {
                  complemento =
                    "Prioridade imediata: recomenda-se iniciar ações práticas, com acompanhamento próximo e metas de evolução claras.";
                } else if (nota <= 7) {
                  complemento =
                    "Em desenvolvimento: recomenda-se consolidar a competência por meio de prática recorrente, feedback e revisão de progresso.";
                } else {
                  complemento =
                    "Ponto forte: recomenda-se usar esta competência como alavanca para apoiar outras áreas de desenvolvimento.";
                }

                return (
                  <li key={i}>
                    <strong>{c.competencia}</strong>: {acaoBase}{" "}
                    <em>{complemento}</em>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="text-block">
            <strong>Conclusão Executiva</strong>
            <p>{conclusaoExecutiva()}</p>
          </div>

          <button className="primary" onClick={() => setTela("inicio")}>
            Voltar ao início
          </button>
        </section>
      </div>
    );
  }

  return null;
}
