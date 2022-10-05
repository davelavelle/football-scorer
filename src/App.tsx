import React, { useEffect, useState } from 'react';
import './App.css';
import Match from './types/match';
import AddMatchCard from './components/addMatch'
import MatchCard from './components/matchCard'
import MatchListItem from './types/matchListItem';

function App() {

  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [pageState, setPageState] = useState<'LISTMATCHES' | 'ADDMATCH' | 'VIEWMATCH'>('LISTMATCHES');


  const [squad, setSquad] = useState<string[]>([]);

  const [match, setMatch] = useState<Match>({
    id: -1,
    halfLength: 1,
    opponent: '',
    matchDate: new Date(),
    location: 'HOME',
    wcfcScore: 0,
    opponentScore: 0,
    wcfcScorers: [],
    wcfcAssists: [],
    opponentScorers: [],
    squad: squad
  });

  const showMatch = (id: number) => {
    var getMatch = localStorage.getItem(`match${id}`);
    if (getMatch) {
      const newMatch = JSON.parse(getMatch) as Match;
      setMatch(newMatch);
      setPageState('VIEWMATCH');
    }
  }

  const showAddMatch = () => {
    setPageState('ADDMATCH');
  }

  const cancelAddMatch = () => {
    setPageState('LISTMATCHES');
  }

  const nextId = () => {
    return matches.length++;
  }

  const saveMatchToList = (id: number, name: string) => {
    const getMatches = localStorage.getItem('matches');
    let currentMatches: MatchListItem[] = [];
    if (getMatches) {
      currentMatches = JSON.parse(getMatches)
    }
    const newMatch: MatchListItem = {
      id: id,
      name: name
    };
    currentMatches.push(newMatch);
    localStorage.setItem('matches', JSON.stringify(currentMatches));
    setMatches(currentMatches);
  }

  useEffect(() => {
    const getMatches = localStorage.getItem('matches');
    if (getMatches) {
      return setMatches(JSON.parse(getMatches));
    }
  }, [setMatches]);

  useEffect(() => {
    const getSquad = localStorage.getItem('squad');
    if (getSquad) {
      return setSquad(JSON.parse(getSquad));
    }
  }, [setSquad]);

  return (
    <div className="App">
      <div className="App container">
        <div className="d-flex align-items-center p-3 my-3 text-white bg-green rounded shadow-sm">
          <div className="lh-1">
            <h1><i className=''></i>WCFC Greens Match Scorers</h1>
          </div>
        </div>
        {pageState === 'LISTMATCHES' &&
          <div className='d-grid gap-2'>
            {matches.map(matchItem => {
              return (
                <button className='btn btn-primary' onClick={() => showMatch(matchItem.id)} >{matchItem.name}</button>
              );
            })}
            <button className='btn btn-warning' onClick={() => showAddMatch()}>ADD MATCH</button>

          </div>
        }
        {pageState === 'ADDMATCH' &&
          <AddMatchCard cancel={cancelAddMatch} id={nextId()} saveToList={saveMatchToList} />
        }
        {pageState === 'VIEWMATCH' &&
          <MatchCard match={match} setMatch={setMatch} squad={squad} />
        }
        {pageState !== 'LISTMATCHES' &&
          <div className='d-grid mt-5 gy-2'>

            <button className='btn btn-warning' onClick={() => setPageState('LISTMATCHES')} >HOME</button>
          </div>
        }
      </div>
    </div >
  );
}

export default App;