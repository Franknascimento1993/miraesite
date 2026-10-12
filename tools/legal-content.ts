// ============================================================
// Documentos legais do NOXA — FONTE ÚNICA (web + app RN, sincronizado).
//
// Política de Privacidade, Termos de Uso e Padrões de Segurança Infantil como
// DADOS, não JSX: a web desenha em /privacy, /terms e /child-safety (URLs
// informadas ao Google Play e à App Store) e o app RN desenha nativamente em
// app/legal/[doc].tsx — o texto nunca diverge.
//
// Cada afirmação corresponde a comportamento verificado no código e no banco
// (auditoria 2026-09-28: LGPD, Google Play User Data/Data safety/UGC, App
// Store 1.2 / 5.1.1 / 5.1.2). Mudou o que o app coleta, compartilha ou modera
// → mudar aqui + store/play-store/DATA_SAFETY.md + store/app-store/
// APP_PRIVACY.md no mesmo PR.
//
// Marcação inline mínima: **negrito** e [[privacy:texto]] / [[terms:texto]] /
// [[child-safety:texto]] (link para outro documento). Sem HTML.
// ============================================================

/** Controladora dos dados e fornecedora do serviço — Comprovante do CNPJ. */
export const LEGAL_ENTITY = {
  entity: "MIRAE LTDA",
  tradeName: "MIRAE",
  cnpj: "27.873.327/0001-24",
  address: "R. da Gameleira, 400, Sala 02, Centro (São Sebastião), Brasília/DF, CEP 71.691-084",
  /** Contato oficial único: suporte, privacidade/LGPD (encarregado), exclusão de conta. */
  contactEmail: "support@miraeai.com.br",
} as const;

export const LEGAL_DOC_IDS = [
  "privacy",
  "terms",
  "child-safety",
  "credits",
  "delete-account",
] as const;

export type LegalDocId = (typeof LEGAL_DOC_IDS)[number];

export function isLegalDocId(value: unknown): value is LegalDocId {
  return typeof value === "string" && (LEGAL_DOC_IDS as readonly string[]).includes(value);
}

export type LegalInline =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "link"; doc: LegalDocId; text: string };

export type LegalListItem = { text: string; children?: string[] };

export type LegalBlock = { kind: "p"; text: string } | { kind: "list"; items: LegalListItem[] };

export type LegalSectionData = { title: string; blocks: LegalBlock[] };

export type LegalDocumentData = {
  id: LegalDocId;
  title: string;
  updatedAt: string;
  sections: LegalSectionData[];
};

/** Produto (nome e origin da web) — vem do config de cada plataforma. */
export type LegalAppInfo = { name: string; url: string };

const INLINE_TOKEN =
  /\*\*(.+?)\*\*|\[\[(privacy|terms|child-safety|credits|delete-account):(.+?)\]\]/g;

/** Quebra um texto com a marcação mínima em trechos (texto, negrito, link). */
export function parseLegalInline(text: string): LegalInline[] {
  const parts: LegalInline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "text", text: text.slice(last, index) });
    if (match[1] !== undefined) parts.push({ kind: "strong", text: match[1] });
    else parts.push({ kind: "link", doc: match[2] as LegalDocId, text: match[3] ?? "" });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) });
  return parts;
}

const p = (text: string): LegalBlock => ({ kind: "p", text });
const list = (...items: (string | LegalListItem)[]): LegalBlock => ({
  kind: "list",
  items: items.map((item) => (typeof item === "string" ? { text: item } : item)),
});

export const LEGAL_UPDATED_AT = "6 de outubro de 2026";

export function buildPrivacyPolicy(app: LegalAppInfo): LegalDocumentData {
  const { entity, tradeName, cnpj, address, contactEmail } = LEGAL_ENTITY;
  const { name, url } = app;
  return {
    id: "privacy",
    title: "Política de Privacidade",
    updatedAt: LEGAL_UPDATED_AT,
    sections: [
      {
        title: "1. Quem somos",
        blocks: [
          p(
            `O ${name} é um app de descoberta social: locais, pessoas e momentos perto de você. Ele é oferecido por **${entity}** (nome fantasia ${tradeName}), CNPJ ${cnpj}, com sede em ${address} — a **controladora** dos seus dados pessoais nos termos da Lei Geral de Proteção de Dados (LGPD).`,
          ),
          p(
            `Esta política vale para o app ${name} no Android e no iOS. O site ${url} só publica este e os demais documentos do ${name}. Encarregado pelo tratamento de dados (DPO): canal **${contactEmail}**.`,
          ),
        ],
      },
      {
        title: "2. Resumo",
        blocks: [
          list(
            `O ${name} é só para maiores de 18 anos.`,
            "Não vendemos seus dados, não exibimos anúncios e não usamos identificador de publicidade.",
            "Sua localização é usada só com o app aberto. Outras pessoas nunca veem seu ponto exato.",
            "Orientação sexual é opcional, fica visível só para você e serve apenas para calcular compatibilidade.",
            "Você pode excluir a conta pelo app a qualquer momento — conta e dados são apagados de verdade.",
          ),
        ],
      },
      {
        title: "3. Dados que coletamos e por quê",
        blocks: [
          list(
            "**Cadastro:** nome, nome de usuário, e-mail e senha (guardada só como hash criptográfico). Finalidade: criar e proteger sua conta. Base legal: execução de contrato (art. 7º, V).",
            "**Perfil:** foto, bio, idade, cidade, profissão, gênero, interesses e status (texto, cor e, se você quiser, o local onde está por até 12 horas). A idade é obrigatória para confirmar a maioridade; você escolhe se ela aparece no seu perfil. Os **interesses** também servem para mostrar o que você tem em comum com quem está perto (só os que vocês dois marcaram) e para sugerir locais e eventos que combinam com você. Base legal: execução de contrato.",
            "**Orientação sexual e gêneros de interesse:** opcionais — veja a seção 4.",
            "**Localização precisa:** veja a seção 5.",
            "**Conteúdo que você cria:** Momentos (fotos, vídeos com o áudio gravado neles, texto, local e pessoas marcadas), mensagens de chat (texto, fotos e reações), curtidas, conexões, coleções e locais salvos. Base legal: execução de contrato.",
            "**Segurança da comunidade:** quem você bloqueou e as denúncias que você fez. Base legal: legítimo interesse e cumprimento de obrigação legal.",
            "**Notificações:** se você ativar, guardamos o identificador de envio do seu aparelho (token de push). Base legal: consentimento, dado pela permissão do sistema.",
            "**Status das mensagens:** quando suas mensagens foram entregues e lidas. Você pode desligar a Confirmação de leitura em Privacidade.",
            '**Uso e erros do app:** eventos internos de uso (por exemplo, "cadastro concluído", o tempo de carregamento do mapa e termos de busca de locais que não tiveram resultado, com uma área aproximada de cerca de 10 km — nunca sua posição exata) e registros de erro, guardados no nosso próprio banco e ligados à sua conta, sem e-mail, senha, orientação ou conteúdo de mensagens. Não usamos ferramentas de análise ou publicidade de terceiros. Base legal: legítimo interesse (melhorar e corrigir o app).',
            "**Registros de acesso:** endereço IP, data e hora de acesso à aplicação, guardados pelo prazo exigido pelo Marco Civil da Internet (Lei 12.965/2014, art. 15). Base legal: cumprimento de obrigação legal.",
          ),
        ],
      },
      {
        title: "4. Dado sensível: orientação sexual",
        blocks: [
          p(
            "Informar sua orientação sexual é **opcional**. Se você informar, o dado é tratado com base no seu **consentimento específico** (LGPD, art. 11, I) e usado apenas para calcular, em nossos servidores, quem é compatível com você no Radar.",
          ),
          list(
            "Ele não aparece no seu perfil e não é enviado a outras pessoas nem a terceiros.",
            "Só você consegue ler esse dado; os outros veem apenas o nível de compatibilidade.",
            "Você revoga o consentimento a qualquer momento em Editar perfil, desmarcando a orientação — o dado é apagado.",
          ),
        ],
      },
      {
        title: "5. Localização",
        blocks: [
          list(
            "Usamos a localização precisa do aparelho **somente com o app aberto**, para mostrar locais e pessoas por perto no Radar. Não coletamos localização em segundo plano.",
            "Enquanto você usa o Radar, sua última posição fica disponível para a descoberta por até 10 minutos. Outras pessoas veem apenas uma **distância aproximada**, calculada a partir de uma área ao seu redor (de cerca de 500 metros onde há mais gente por perto, ou de cerca de 2 km nos demais casos), e sua foto posicionada com deslocamento no mapa — nunca seu ponto exato.",
            "O **Modo Invisível** tira você da descoberta e apaga sua presença na hora.",
            "Você pode negar ou revogar a permissão de localização nas configurações do aparelho; o Radar deixa de funcionar, o resto do app continua.",
          ),
          p("Base legal: execução de contrato (é o que faz o Radar funcionar)."),
        ],
      },
      {
        title: "6. Câmera, fotos e microfone",
        blocks: [
          p(
            "O app acessa a câmera e as fotos apenas quando você escolhe enviar uma imagem ou vídeo, e só o arquivo que você escolher. A edição (cortar, girar, filtros) acontece no seu aparelho. O microfone é usado apenas pela câmera do sistema ao gravar um vídeo, e o áudio fica dentro do vídeo que você publicar.",
          ),
        ],
      },
      {
        title: "7. Como usamos seus dados",
        blocks: [
          list(
            "Criar sua conta, exibir seu perfil e permitir a descoberta de locais e pessoas.",
            "Entregar mensagens, Momentos, reações e notificações que você pediu.",
            "Calcular compatibilidade e distâncias aproximadas no Radar.",
            "Moderar conteúdo, investigar denúncias e proteger a comunidade.",
            "Corrigir erros e melhorar o app.",
            "Cumprir obrigações legais e atender autoridades competentes.",
          ),
          p(
            "Não tomamos decisões automatizadas que produzam efeitos jurídicos sobre você. A compatibilidade do Radar apenas ordena e filtra quem aparece; ela não bloqueia contatos.",
          ),
        ],
      },
      {
        title: "8. Com quem compartilhamos",
        blocks: [
          p(`**Não vendemos nem alugamos seus dados.** Não há anúncios no ${name}.`),
          list(
            "**Outros usuários logados** veem seu perfil público (nome, @, foto, bio, cidade, profissão, gênero, interesses, status e, se você permitir, a idade), seus Momentos conforme a visibilidade que você escolheu (Público, Rede ou Privado), sua presença aproximada no Radar (salvo Modo Invisível) e as mensagens que você envia a quem conversa com você.",
            {
              text: "**Operadores** que processam dados apenas em nosso nome e para operar o serviço:",
              children: [
                "Supabase — banco de dados, autenticação, arquivos de mídia e funções de servidor;",
                "Vercel — hospedagem do site com estes documentos (registra o IP de quem o acessa);",
                "Resend — envio de e-mails da conta e de alertas de moderação;",
                "Google Firebase Cloud Messaging — entrega de notificações;",
                "OpenFreeMap — imagens do mapa (seu aparelho baixa a área exibida, o que expõe seu IP a esse serviço);",
                "Google Fonts e jsDelivr — fontes e bibliotecas carregadas pelo site com estes documentos.",
              ],
            },
            '**Serviços que você aciona:** ao tocar em "Como chegar", o endereço do local é aberto no Google Maps, sujeito à política do Google. As informações de locais vêm do OpenStreetMap, baixadas pelos nossos servidores sem nenhum dado seu; a busca de locais acontece só no nosso banco.',
            "**Autoridades**, quando houver obrigação legal ou ordem judicial, e para proteger a segurança de pessoas.",
          ),
        ],
      },
      {
        title: "9. Transferência internacional",
        blocks: [
          p(
            "Nossos servidores e parte dos operadores ficam fora do Brasil, principalmente nos Estados Unidos. Essas transferências seguem o art. 33 da LGPD, com operadores que oferecem garantias contratuais de proteção de dados compatíveis com a lei brasileira.",
          ),
        ],
      },
      {
        title: "10. Por quanto tempo guardamos",
        blocks: [
          list(
            "Enquanto sua conta existir, mantemos os dados necessários para o serviço.",
            "Presença no Radar: some da descoberta após 10 minutos sem atualização.",
            "Local no status: expira em 12 horas.",
            "Registros de acesso: pelo prazo legal (6 meses, Marco Civil da Internet), mesmo após a exclusão da conta.",
          ),
          p(
            `**Exclusão da conta:** no app, Perfil → Configurações → Privacidade → Excluir conta; instruções e pedido sem o app em [[delete-account:Exclusão de conta]] (${url}/delete-account). A exclusão é imediata e apaga sua conta, perfil, dados sensíveis, Momentos, fotos e vídeos, as mensagens que você enviou (que deixam de aparecer também para quem as recebeu), reações, conexões, coleções, locais salvos, presença, tokens de notificação e as denúncias que você fez. Eventos internos de uso ficam desvinculados de você (anônimos). Cópias de segurança automáticas do nosso provedor são sobrescritas em até 30 dias. Se não conseguir entrar na conta, peça a exclusão em ${contactEmail}.`,
          ),
        ],
      },
      {
        title: "11. Seus direitos (LGPD, art. 18)",
        blocks: [
          p("Você pode, a qualquer momento:"),
          list(
            "confirmar se tratamos seus dados e acessá-los;",
            "corrigir dados incompletos, inexatos ou desatualizados (em Editar perfil);",
            "pedir anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;",
            "pedir a portabilidade dos seus dados;",
            "eliminar dados tratados com consentimento e revogar esse consentimento;",
            "saber com quem compartilhamos seus dados;",
            "ser informado sobre a possibilidade de não consentir e suas consequências.",
          ),
          p(
            `Para pedidos que não estão no app (acesso, portabilidade, informações), escreva para **${contactEmail}** a partir do e-mail da sua conta. Respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
          ),
        ],
      },
      {
        title: "12. Suas escolhas no app",
        blocks: [
          list(
            "Modo Invisível — sai da descoberta no Radar.",
            "Visibilidade de cada Momento — Público, Rede ou Privado.",
            "Confirmação de leitura — liga e desliga em Privacidade.",
            "Notificações — pela permissão do aparelho.",
            "Bloquear e denunciar — no perfil da pessoa, na conversa e nos Momentos.",
          ),
        ],
      },
      {
        title: "13. Moderação e segurança da comunidade",
        blocks: [
          p(
            "Você pode denunciar perfis, Momentos e mensagens. Toda denúncia é registrada e analisada pela nossa equipe em até 24 horas; para isso, podemos acessar o conteúdo denunciado, inclusive mensagens privadas denunciadas por quem as recebeu. Conteúdo que viola os [[terms:Termos de Uso]] é removido e contas responsáveis podem ser suspensas ou excluídas.",
          ),
        ],
      },
      {
        title: "14. Segurança",
        blocks: [
          p(
            "Usamos conexões criptografadas (HTTPS/TLS), senhas com hash, controle de acesso por linha no banco de dados (cada pessoa só lê o que tem permissão) e dados sensíveis separados em área acessível apenas ao titular. Fotos e vídeos são armazenados em endereços difíceis de adivinhar; quem receber o link direto de um arquivo consegue abri-lo, por isso não compartilhe links de mídia fora do app. Nenhum sistema é 100% seguro; se houver um incidente relevante, avisaremos você e a ANPD conforme a lei.",
          ),
        ],
      },
      {
        title: "15. Menores de idade",
        blocks: [
          p(
            `O ${name} é exclusivo para maiores de 18 anos e exige a idade no cadastro. Não coletamos intencionalmente dados de menores. Se identificarmos uma conta de menor, ela é excluída. Viu um perfil de menor? Denuncie pelo app com o motivo "Menor de idade". Veja também os [[child-safety:Padrões de Segurança Infantil]].`,
          ),
        ],
      },
      {
        title: "16. Publicidade, rastreamento e armazenamento local",
        blocks: [
          p(
            "Não exibimos anúncios, não usamos o identificador de publicidade do aparelho e não rastreamos você em apps ou sites de outras empresas.",
          ),
        ],
      },
      {
        title: "17. Alterações",
        blocks: [
          p(
            "Podemos atualizar esta política. Mudanças relevantes serão avisadas no app ou por e-mail antes de valerem. A data no topo indica a versão atual.",
          ),
        ],
      },
      {
        title: "18. Contato",
        blocks: [
          p(`Dúvidas, pedidos sobre seus dados ou contato com o encarregado: **${contactEmail}**.`),
        ],
      },
    ],
  };
}

export function buildTermsOfUse(app: LegalAppInfo): LegalDocumentData {
  const { entity, tradeName, cnpj, address, contactEmail } = LEGAL_ENTITY;
  const { name } = app;
  return {
    id: "terms",
    title: "Termos de Uso",
    updatedAt: LEGAL_UPDATED_AT,
    sections: [
      {
        title: "1. Aceitação",
        blocks: [
          p(
            `Estes Termos regem o uso do ${name}, oferecido por **${entity}** (nome fantasia ${tradeName}), CNPJ ${cnpj}, com sede em ${address}. Ao criar uma conta, você declara ter **18 anos ou mais**, capacidade civil plena, e aceita estes Termos e a [[privacy:Política de Privacidade]]. Se não concordar, não use o app.`,
          ),
        ],
      },
      {
        title: "2. O serviço",
        blocks: [
          p(
            `O ${name} ajuda você a descobrir locais, pessoas e momentos por perto: Radar com mapa, perfis, Momentos (fotos, vídeos e textos), conexões, coleções e chat entre pessoas conectadas. O uso é gratuito e não há compras dentro do app. Podemos mudar, adicionar ou retirar funcionalidades para melhorar o serviço.`,
          ),
        ],
      },
      {
        title: "3. Sua conta",
        blocks: [
          list(
            "Uma pessoa, uma conta. Use informações verdadeiras — nada de perfis falsos.",
            "Não se passe por outra pessoa, marca ou empresa.",
            "Guarde sua senha; você responde pelo que for feito na sua conta.",
            "Você pode excluir a conta a qualquer momento pelo app (seção 10).",
          ),
        ],
      },
      {
        title: "4. Regras da comunidade — tolerância zero",
        blocks: [
          p(
            "Não há tolerância para conteúdo ofensivo ou abusivo. É proibido publicar, enviar ou promover, em perfis, status, Momentos ou mensagens:",
          ),
          list(
            "nudez, pornografia ou conteúdo sexual explícito;",
            "qualquer conteúdo envolvendo menores de 18 anos de forma sexual ou que os coloque em risco — denunciamos às autoridades (veja os [[child-safety:Padrões de Segurança Infantil]]);",
            "assédio, ameaças, perseguição, intimidação ou envio insistente de mensagens a quem não quer contato;",
            "discurso de ódio ou discriminação por raça, cor, etnia, religião, origem, gênero, orientação sexual, deficiência ou qualquer outra condição;",
            "violência explícita, apologia a crimes, terrorismo ou automutilação;",
            "venda ou oferta de drogas ilícitas, armas ou qualquer produto ou serviço ilegal;",
            "golpes, spam, propaganda não solicitada, correntes ou links maliciosos;",
            "dados pessoais de terceiros sem autorização (endereço, telefone, documentos) ou imagens íntimas de qualquer pessoa sem consentimento;",
            "conteúdo que viole direitos autorais, de marca ou de imagem de terceiros;",
            "tentativas de burlar a segurança do app, coletar dados de outros usuários ou usar robôs e automações.",
          ),
        ],
      },
      {
        title: "5. Denúncia, bloqueio e moderação",
        blocks: [
          list(
            "Você pode **denunciar** perfis, Momentos e mensagens e **bloquear** qualquer pessoa pelo perfil dela ou pelo menu da conversa. Quem você bloqueia deixa de ver você e de falar com você no app.",
            "Analisamos as denúncias em até **24 horas**. Conteúdo que viola estes Termos é removido e a conta responsável pode ser advertida, suspensa ou excluída, sem aviso prévio nos casos graves.",
            "Não moderamos todo conteúdo antes da publicação, mas podemos remover, a qualquer momento, conteúdo que viole estes Termos ou a lei.",
            "Em caso de risco à vida ou crime, contate imediatamente as autoridades (190). Denúncias no app não substituem a polícia.",
          ),
        ],
      },
      {
        title: "6. Seu conteúdo",
        blocks: [
          p(
            `O que você publica continua sendo seu. Para o app funcionar, você nos concede uma licença gratuita, não exclusiva e limitada ao ${name} para armazenar, exibir e transmitir esse conteúdo conforme a visibilidade que você escolher. A licença termina quando você apaga o conteúdo ou exclui a conta. Você garante ter os direitos sobre o que publica e responde por ele.`,
          ),
        ],
      },
      {
        title: "7. Localização e encontros",
        blocks: [
          p(
            "O Radar usa sua localização com o app aberto (veja a [[privacy:Política de Privacidade]]). Encontros presenciais com pessoas conhecidas pelo app são de sua responsabilidade: prefira locais públicos, avise alguém de confiança e não compartilhe dados sensíveis com quem acabou de conhecer. Não verificamos antecedentes nem a identidade dos usuários.",
          ),
        ],
      },
      {
        title: "8. Propriedade intelectual",
        blocks: [
          p(
            `A marca ${name}, o app, o design, as figurinhas e o código pertencem à ${entity} ou a seus licenciantes. Concedemos a você uma licença pessoal, gratuita, intransferível e não exclusiva para usar o app em aparelhos que você possui ou controla, conforme estes Termos e as regras da loja de onde você o baixou. Não é permitido copiar, modificar, fazer engenharia reversa ou revender o app.`,
          ),
        ],
      },
      {
        title: "9. Responsabilidade",
        blocks: [
          p(
            `Trabalhamos para manter o ${name} disponível e seguro, mas o serviço pode ter interrupções, falhas ou informações de terceiros (como dados de locais) desatualizadas. Nos limites permitidos pela lei, não respondemos por conteúdo publicado por usuários nem por condutas de usuários fora do app. Nada nestes Termos afasta direitos garantidos pelo Código de Defesa do Consumidor.`,
          ),
        ],
      },
      {
        title: "10. Suspensão e exclusão",
        blocks: [
          p(
            "Você pode excluir a conta quando quiser em Perfil → Configurações → Privacidade → Excluir conta. A exclusão é imediata e irreversível e apaga seus dados conforme a [[privacy:Política de Privacidade]]. Podemos suspender ou encerrar contas que violem estes Termos, a lei ou coloquem outras pessoas em risco.",
          ),
        ],
      },
      {
        title: "11. Lojas de aplicativos",
        blocks: [
          p(
            `Estes Termos são firmados entre você e a ${entity} — não com a Apple nem com o Google. Somos os únicos responsáveis pelo app, por seu suporte, manutenção e por qualquer reclamação relacionada a ele (inclusive de produto, de conformidade legal e de propriedade intelectual); Apple e Google não têm obrigação de prestar suporte. Você declara não estar em país sujeito a embargo dos Estados Unidos nem em lista de pessoas sujeitas a restrições do governo dos Estados Unidos. Você também deve cumprir os termos da loja e dos serviços de terceiros que usar. A Apple e suas subsidiárias são terceiras beneficiárias destes Termos e, ao aceitá-los, você reconhece o direito da Apple de exigi-los em relação a você.`,
          ),
        ],
      },
      {
        title: "12. Alterações",
        blocks: [
          p(
            "Podemos atualizar estes Termos. Mudanças relevantes serão avisadas no app ou por e-mail antes de valerem; se você continuar usando o app depois disso, as novas regras passam a valer. Se não concordar, exclua sua conta.",
          ),
        ],
      },
      {
        title: "13. Lei aplicável e foro",
        blocks: [
          p(
            "Estes Termos seguem as leis da República Federativa do Brasil. Fica eleito o foro do domicílio do usuário para resolver qualquer conflito, conforme o Código de Defesa do Consumidor.",
          ),
        ],
      },
      {
        title: "14. Contato",
        blocks: [p(`Dúvidas, suporte ou denúncias fora do app: **${contactEmail}**.`)],
      },
    ],
  };
}

/**
 * Padrões de Segurança Infantil — página pública exigida pela política de
 * Padrões de Segurança Infantil do Google Play (apps Social / Encontros):
 * proíbe explicitamente exploração e abuso sexual infantil (CSAE), diz como
 * denunciar no app e o que fazemos, e nomeia o contato. URL declarada no
 * Play Console (store/play-store/CONSOLE_CHECKLIST.md § Padrões de segurança
 * infantil). Processo interno: docs/operations/INCIDENT_RESPONSE.md
 * § Moderação. Cada afirmação bate com o app: 18+ no cadastro e no banco
 * (CHECK age >= 18), chat só entre conectados (ADR-020), motivo "Menor de
 * idade" nas denúncias de perfil, Momento e mensagem, `reports` sem leitura
 * para usuários (denúncia confidencial), alerta `report-alert`, prazo de 24 h.
 */
export function buildChildSafetyStandards(app: LegalAppInfo): LegalDocumentData {
  const { entity, contactEmail } = LEGAL_ENTITY;
  const { name, url } = app;
  return {
    id: "child-safety",
    title: "Padrões de Segurança Infantil",
    updatedAt: LEGAL_UPDATED_AT,
    sections: [
      {
        title: "1. Tolerância zero",
        blocks: [
          p(
            `O ${name}, oferecido por **${entity}**, tem **tolerância zero** com exploração e abuso sexual infantil (CSAE), incluindo material de abuso sexual infantil (CSAM). Estes padrões valem para o app no Android e no iOS, em perfis, status, Momentos, mensagens e qualquer outro conteúdo.`,
          ),
          p(
            `O ${name} é exclusivo para maiores de 18 anos. Crianças e adolescentes não podem ter conta.`,
          ),
        ],
      },
      {
        title: "2. O que é proibido",
        blocks: [
          list(
            "produzir, publicar, enviar, pedir, guardar ou divulgar fotos, vídeos ou textos de abuso ou exploração sexual de menores de 18 anos — reais, simulados, editados ou gerados por computador;",
            "sexualizar crianças ou adolescentes de qualquer forma, inclusive em legendas, status ou mensagens;",
            "aliciar, assediar ou tentar contato sexual ou romântico com menores de 18 anos, dentro ou fora do app;",
            "pressionar, chantagear ou ameaçar menores de 18 anos para obter imagens íntimas (sextorsão);",
            "promover, facilitar ou combinar exploração, tráfico ou encontros com menores de 18 anos.",
          ),
          p(
            "Essas condutas são crimes no Brasil (Estatuto da Criança e do Adolescente, arts. 240 a 241-E) e levam à exclusão imediata da conta e à comunicação às autoridades.",
          ),
        ],
      },
      {
        title: "3. Como prevenimos",
        blocks: [
          list(
            "**Só maiores de 18 anos:** o cadastro exige declarar ter 18 anos ou mais e informar a idade; nosso banco de dados recusa idade abaixo de 18.",
            "**Regras aceitas no cadastro:** os [[terms:Termos de Uso]] proíbem conteúdo sexual envolvendo menores e precisam ser aceitos para criar a conta.",
            "**Sem mensagens de desconhecidos:** o chat só abre entre pessoas conectadas — uma envia interesse e a outra aceita.",
            "**Localização protegida:** ninguém vê o ponto exato de outra pessoa no Radar, só uma distância aproximada; o Modo Invisível tira a pessoa da descoberta.",
            "**Bloqueio:** qualquer pessoa pode bloquear outra pelo perfil ou pela conversa.",
          ),
        ],
      },
      {
        title: "4. Como denunciar no app",
        blocks: [
          list(
            "**Perfil:** no perfil da pessoa, toque no menu ⋮ e em Denunciar.",
            "**Momento:** com o Momento aberto em tela cheia, toque na bandeira.",
            "**Mensagem:** segure a mensagem na conversa e toque em Denunciar.",
          ),
          p(
            `Escolha o motivo **"Menor de idade"** quando a denúncia envolver uma criança ou um adolescente. A denúncia é confidencial: a pessoa denunciada não vê quem denunciou. Sem acesso ao app, escreva para **${contactEmail}**.`,
          ),
        ],
      },
      {
        title: "5. O que fazemos",
        blocks: [
          list(
            "Toda denúncia é registrada e avisa a nossa equipe de moderação na hora. Analisamos em até **24 horas**.",
            "Conta de menor de idade é excluída.",
            "Conteúdo de exploração ou abuso sexual infantil é removido e a conta responsável é excluída, sem aviso prévio.",
            "Registramos as informações necessárias à investigação (conta, datas e identificadores do conteúdo) e comunicamos o caso às autoridades competentes — **Polícia Federal** e **Central Nacional de Denúncias da SaferNet Brasil**.",
            "Cooperamos com as autoridades e cumprimos ordens judiciais e requisições legais.",
          ),
        ],
      },
      {
        title: "6. Ajuda fora do app",
        blocks: [
          p(
            "Se uma criança ou um adolescente estiver em perigo agora, ligue para a polícia (**190**). Você também pode denunciar diretamente:",
          ),
          list(
            "**Disque 100** — Disque Direitos Humanos, gratuito, 24 horas;",
            "**SaferNet Brasil** — new.safernet.org.br/denuncie;",
            "o Conselho Tutelar da sua cidade.",
          ),
        ],
      },
      {
        title: "7. Contato de segurança infantil",
        blocks: [
          p(
            `Ponto de contato para segurança infantil, inclusive para autoridades: **${contactEmail}**. Veja também a [[privacy:Política de Privacidade]].`,
          ),
        ],
      },
    ],
  };
}

export const MAP_CREDITS_UPDATED_AT = "4 de outubro de 2026";

/**
 * Créditos do mapa — licença que o Radar mostra só na abertura (5 s,
 * `lib/radar/map-credit.ts`). Diretrizes da OSM Foundation: com o crédito
 * recolhido, a licença tem de estar num menu — Configurações → Privacidade.
 */
export function buildMapCredits(app: LegalAppInfo): LegalDocumentData {
  return {
    id: "credits",
    title: "Créditos do mapa",
    updatedAt: MAP_CREDITS_UPDATED_AT,
    sections: [
      {
        title: "Dados do mapa",
        blocks: [
          p(
            `Os locais e o mapa do ${app.name} usam dados do **OpenStreetMap** © colaboradores do OpenStreetMap, disponíveis sob a **Open Database License (ODbL)**. Licença e créditos: openstreetmap.org/copyright.`,
          ),
        ],
      },
      {
        title: "Imagens do mapa",
        blocks: [p("**OpenFreeMap** (openfreemap.org) · © **OpenMapTiles** (openmaptiles.org).")],
      },
    ],
  };
}

/**
 * Exclusão de conta — página **pública** (sem login) declarada no Play Console
 * (Data safety → exclusão de conta). O app web não é produto (2026-10-06): a
 * página só explica o caminho no app e o pedido por e-mail. Mesmo conteúdo do
 * § Exclusão da Política e de `store/play-store/CONSOLE_CHECKLIST.md`.
 */
export function buildAccountDeletion(app: LegalAppInfo): LegalDocumentData {
  const { entity, contactEmail } = LEGAL_ENTITY;
  return {
    id: "delete-account",
    title: "Exclusão de conta",
    updatedAt: LEGAL_UPDATED_AT,
    sections: [
      {
        title: "1. No app",
        blocks: [
          p(
            `No ${app.name}, vá em **Perfil → Configurações → Privacidade → Excluir conta** e confirme. A exclusão é **imediata** e não pode ser desfeita.`,
          ),
        ],
      },
      {
        title: "2. Sem o app ou sem acesso à conta",
        blocks: [
          p(
            `Envie um e-mail para **${contactEmail}** a partir do endereço cadastrado, com o assunto "Excluir conta". Confirmamos a titularidade e excluímos a conta em até 15 dias. ${entity} é a responsável pelo pedido.`,
          ),
        ],
      },
      {
        title: "3. O que é apagado",
        blocks: [
          list(
            "Conta, perfil e dados sensíveis (como orientação sexual, se informada).",
            "Momentos, fotos e vídeos.",
            "Mensagens que você enviou — deixam de aparecer também para quem as recebeu.",
            "Reações, conexões, coleções e locais salvos.",
            "Presença no Radar, tokens de notificação e as denúncias que você fez.",
          ),
        ],
      },
      {
        title: "4. O que é mantido",
        blocks: [
          list(
            "Registros de acesso (IP, data e hora) por 6 meses — obrigação do Marco Civil da Internet (art. 15).",
            "Eventos internos de uso, desvinculados de você (anônimos).",
            "Cópias de segurança automáticas do nosso provedor, sobrescritas em até 30 dias.",
          ),
          p("Mais detalhes na [[privacy:Política de Privacidade]]."),
        ],
      },
    ],
  };
}

export function buildLegalDocument(doc: LegalDocId, app: LegalAppInfo): LegalDocumentData {
  if (doc === "delete-account") return buildAccountDeletion(app);
  if (doc === "privacy") return buildPrivacyPolicy(app);
  if (doc === "credits") return buildMapCredits(app);
  if (doc === "child-safety") return buildChildSafetyStandards(app);
  return buildTermsOfUse(app);
}

/** Rodapé de identificação (controladora + contato) — igual nas duas plataformas. */
export function legalFooterLine(): string {
  const { entity, cnpj, address, contactEmail } = LEGAL_ENTITY;
  return `${entity} · CNPJ ${cnpj} · ${address} · ${contactEmail}`;
}
