import Head from 'next/head';
import styles from '../../styles/About.module.css';
import Layout from '../../components/Layout';

export default function About() {
    const team = [
    {
      name: "Schiavinato – Fundador",
      user: "Schiavinato",
      description:
        "Idealizador da Lotus Habbo e responsável por estruturar os princípios e objetivos do projeto desde sua criação.",
    },
    {
      name: "VovoDell – CEO",
      user: "VovoDell",
      description:
        "Coordena e supervisiona todas as áreas do projeto, garantindo a execução das atividades com responsabilidade e liderança.",
    },
    {
      name: "Heloiseee – CEO e Diretora de Cronograma e Eventos",
      user: "Heloiseee",
      description:
        "Responsável pela organização dos eventos, planejamento de cronogramas e liderança criativa em ações e competições.",
    },
    {
      name: "HenriqueHK. – Diretor de Patrocínio e Divulgação",
      user: "HenriqueHK.",
      description:
        "Atua na captação de apoios, parcerias e reforça a presença da Lotus dentro e fora do jogo.",
    },
    {
      name: "@Pandinha.. – Diretora de Artes Visuais e Organização",
      user: "@Pandinha..",
      description:
        "Responsável pela produção gráfica, gestão de cronogramas e controle de prestação de contas do projeto.",
    },
    {
      name: "Vinezao – Desenvolvedor Web",
      user: "Vinezao",
      description: "Cria e mantém o site oficial da Lotus Habbo.",
    },
    {
      name: "Rastafar-I – Desenvolvedor Web e Wired",
      user: "Rastafar-i",
      description:
        "Auxilia no desenvolvimento do site e realiza a programação técnica dos wireds para os eventos.",
    },
    {
      name: "Debx_x – Desenvolvedora do Servidor Discord",
      user: "Debx_x",
      description:
        "Gerencia a estrutura do servidor, bots e automações de verificação e suporte interno.",
    },
    {
      name: "DomPedr0 – Animador de Torcida",
      user: "DomPedr0",
      description:
        "Atua como incentivador e figura de apoio em eventos, interagindo com o público de forma engajada e participativa.",
    },
    {
      name: "Webeert – Influenciador",
      user: "Webeert",
      description:
        "Atua como ponto de divulgação, principalmente via Instagram e interações com a comunidade.",
    },
    {
      name: ".Nome – Webdesigner",
      user: ".Nome",
      description:
        "Responsável pela identidade visual  e elementos gráficos relacionados à apresentação digital do projeto.",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Sobre Nós – Lotus Habbo</title>
        <meta
          name="description"
          content="Conheça a equipe e o propósito da Lotus Habbo."
        />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Sobre Nós – Lotus Habbo</h1>
        <p className={styles.paragraph}>
          A Lotus Habbo é um projeto independente e colaborativo, idealizado para promover eventos,
          competições criativas e experiências marcantes dentro do Habbo Hotel. Nosso foco é valorizar o
          talento da comunidade com seriedade, transparência e muita diversão.
        </p>
        <p className={styles.paragraph}>
          Nosso diferencial está na dedicação de uma equipe comprometida com a organização, inovação e a
          criação de um ambiente justo e acolhedor para todos os jogadores.
        </p>

        <h2 className={styles.subtitle}>Conheça nosso time:</h2>
        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} className={styles.card}>
              <img
                src={`https://www.habbo.com.br/habbo-imaging/avatarimage?&user=${member.user}&action=&direction=2&head_direction=3&img_format=png&gesture=std&frame=0&headonly=0&size=m`}
                alt={member.user}
                className={styles.avatar}
              />
              <div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberDesc}>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
