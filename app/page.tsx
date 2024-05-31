"use client";
import Lyrics from "./components/Lyrics";

const lyricsText = `[Letra de "Como Nossos Pais"]

[Verso 1]
Não quero lhe falar, meu grande amor
Das coisas que aprendi nos discos
Quero lhe contar como eu vivi
E tudo o que aconteceu comigo
Viver é melhor que sonhar
E eu sei que o amor é uma coisa boa
Mas também sei que qualquer canto
É menor do que a vida de qualquer pessoa
Por isso cuidado, meu bem
Há perigo na esquina
Eles venceram e o sinal está fechado
Pra nós que somos jovens
Para abraçar meu irmão
E beijar minha menina na rua
É que se fez o meu lábio
O meu braço e a minha voz

[Ponte]
Você me pergunta pela minha paixão
Digo que estou encantado com uma nova invenção
Vou ficar nesta cidade, não, não vou voltar pro sertão
Pois vejo vir vindo no vento o cheiro da nova estação
E eu sei de tudo na ferida viva do meu coração

[Pré-Refrão]
Já faz tempo, eu vi você na rua
Cabelo ao vento, gente jovem reunida
Na parede da memória, esta lembrança
É o quadro que dói mais

[Refrão]
Minha dor é perceber que
Apesar de termos feito tudo, tudo o que fizemos
Ainda somos os mesmos e vivemos
Ainda somos os mesmos e vivemos
Como os nossos pais

[Verso 2]
Nossos ídolos ainda são os mesmos
E as aparências, as aparências não enganam, não
Você diz que depois deles
Não apareceu mais ninguém
Você pode até dizer que eu estou por fora
Ou então que eu estou inventando
Mas é você que ama o passado e que não vê
É você que ama o passado e que não vê
Que o novo, o novo sempre vem
E hoje eu sei que quem me deu a ideia
De uma nova consciência e juventude
Está em casa guardado por Deus
Contando os seus metais

[Refrão]
Minha dor é perceber que
Apesar de termos feito tudo, tudo o que fizemos
Ainda somos os mesmos e vivemos
Ainda somos os mesmos e vivemos
Ainda somos os mesmos e vivemos
Como os nossos pais`;

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lyrics Annotations</h1>
      <Lyrics lyrics={lyricsText} />
    </div>
  );
};

export default Home;
