import {GetStaticProps} from 'next';
import Image from'next/image';
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from '../pages/home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContexts';
import  Head  from 'next/head';

type Episodes = {
      id: string;
      title: string;
      publishedAt: string;
      thumbnail: string;
      members: string;
      durationAsString: string;
      url: string;
      description:string;
      duration:number;
}


type HomeProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({ latestEpisodes, allEpisodes}: HomeProps) {

  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcast</title>
      </Head>
      <section className={styles.latestEpisodes}>
          <h2>últimos lançamentos</h2>

          <ul>
            {latestEpisodes.map((episode, index) => {
              return(
                <li key={episode.id}>
                  <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                  />
                  
                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a >{episode.title}</a>
                    </Link>

                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button type="button" onClick={() => playList(episodeList, index)}>
                    <img src="/play-green.svg" alt=""/>
                  </button>
                </li>
              )
            })}
          </ul>
      </section>

      <section className={styles.allEpisodes}>
              <h2>Todos episodios</h2>
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Podcast</th>
                    <th>Integrantes</th>
                    <th>Data</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {allEpisodes.map((episode, index) => {
                    return(
                        <tr key={episode.id}>
                          <td style={{width:72}}>
                            <Image
                                width={120}
                                height={120}
                                src={episode.thumbnail}
                                alt={episode.title}
                                objectFit="cover"
                            />
                          </td>
                          <td>
                            <Link href={`/episodes/${episode.id}`}>
                               <a>{episode.title}</a>
                            </Link>
                            
                          </td>
                          <td>{episode.members}</td>
                          <td style={{width:100}}>{episode.publishedAt}</td>
                          <td>{episode.durationAsString}</td>
                          <td>
                            <button type="button" onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                              <img src="/play-green.svg" alt="Tocar episodio"/>
                            </button>
                          </td>
                        </tr>


                    );
                  })}
                </tbody>
              </table>
      </section>    

    </div>
  )
}

export const  getStaticProps: GetStaticProps  = async () => {
  const response = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'

    }
  })
  const data = await response.data

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MM y', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return{
    props:{
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
