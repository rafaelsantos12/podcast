import { createContext,  useState, ReactNode } from 'react';




type Episode = {
    title:string;
    members: string;
    thumbnail:string;
    duration:number;
    url:string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    playList: (list: Episode[], index: number) => void;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    cleanPlayerState: () => void;
 
};



export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode,
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffiling] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffiling(!isShuffling);
  }

  function cleanPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);

  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext(){
      const nextEpisodeIndex = currentEpisodeIndex + 1;

      if(isShuffling){
        const nextRandomEpisodeIndex= Math.floor(Math.random()* episodeList.length);

        setCurrentEpisodeIndex(nextRandomEpisodeIndex);

      } else if(hasNext){
          setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
  }

  function playPrevious(){

    if(hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
}


  return (
    <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            playList,
            isPlaying,
            playNext,
            playPrevious,
            togglePlay, 
            setPlayingState, 
            hasNext,
            hasPrevious,
            toggleLoop,
            isLooping,
            toggleShuffle,
            isShuffling,
            cleanPlayerState
        }}
    >
        {children}
    </PlayerContext.Provider>
  )
}
