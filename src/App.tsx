import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { Match } from './types/match';
import ScoreCard from './components/scoreCard'
import Event from './types/event'

function App() {

  const [timeGone, setTimeGone] = useState<string>('')

  const scorers: Event[] = [{
    player: 'Sam',
    time: 23
  }]

  const assists: Event[] = [{
    player: 'Evan',
    time: 23
  }]

  const match: Match = {
    kickOffTime: new Date(2022, 9, 3, 15, 15, 0),
    halfTime: new Date(2022, 9, 3, 15, 46, 12),
    kickOffTime2ndHalf: new Date(2022, 9, 3, 15, 55, 12),
    fullTime: new Date(2022, 9, 3, 16, 12, 12),
    halfLength: 30,
    opponent: 'Droylsden',
    location: 'HOME',
    wcfcScore: 5,
    opponentScore: 2,
    wcfcScorers: scorers,
    wcfcAssists: assists,
    opponentScorers: []
  }

  function calculateTimeGone(kickOffTime: Date, halfOffset: number) {
    const now: Date = new Date();
    const diffTime: number = (now.getTime() - kickOffTime.getTime()) / 60000;
    const minutes = parseInt(diffTime.toString());
    const seconds = parseInt(((diffTime - minutes) * 60).toString());
    const leadingZero = seconds < 10 ? '0' : '';
    return `${minutes + halfOffset}:${leadingZero}${seconds}`;

  }

  const updateTimeGone = useCallback(
    () => {

      if (match.halfTime && !match.kickOffTime2ndHalf) {
        return setTimeGone('H-T');
      }
      if (match.fullTime) {
        return setTimeGone('F-T');
      }

      if (match.kickOffTime2ndHalf)
        return setTimeGone(calculateTimeGone(match.kickOffTime2ndHalf, match.halfLength));

      if (match.kickOffTime)
        return setTimeGone(calculateTimeGone(match.kickOffTime, 0));

      return setTimeGone('');
    }, [match.kickOffTime, match.halfTime, match.fullTime, match.kickOffTime2ndHalf, match.halfLength]);

  useEffect(() => {
    setTimeout(updateTimeGone, 1000);
  }, [updateTimeGone])

  return (
    <div className="App">
      <div className="App container">
        <div className="d-flex align-items-center p-3 my-3 text-white bg-green rounded shadow-sm">
          <div className="lh-1">
            <h1><i className=''></i>WCFC Greens Match Scorers</h1>
          </div>
        </div>
        <div className="row">
          <div className='text-center fs-2'>
            {timeGone}
          </div>
          <ScoreCard team='WCFC Greens' score={match.wcfcScore} scorers={match.wcfcScorers} assists={match.wcfcAssists} />
          <ScoreCard team={match.opponent} score={match.opponentScore} scorers={match.opponentScorers} />
        </div>
      </div>
    </div>
  );
}

export default App;