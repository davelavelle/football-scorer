import React, { useEffect, useCallback, useState } from 'react';
import Match from '../../types/match';
import ScoreCard from '../scoreCard'
import Event from '../../types/event'

export default function MatchCard({ match, setMatch, squad }: MatchProps) {

    const [timeGone, setTimeGone] = useState<string>('')
    const [matchStatus, setMatchStatus] = useState<'KICKOFF' | 'HALFTIME' | 'SECONDHALF' | 'FULLTIME' | 'MATCHENDED'>('KICKOFF')
    const [goalScoredStatus, setGoalScoredStatus] = useState<'INPLAY' | 'CHOOSETEAM' | 'CHOOSEPLAYER' | 'CHOOSEASSIST' | 'SAVEGOAL'>('INPLAY')
    const [goalScoredTime, setGoalScoredTime] = useState<number>(0)
    const [goalScoredTeam, setGoalScoredTeam] = useState<string>('')
    const [goalScoredPlayer, setGoalScoredPlayer] = useState<string>('')
    const [goalScoredAssist, setGoalScoredAssist] = useState<string>('')
    const [oppositionScorer, setOppositionScorer] = useState<string>('')

    function calculateTimeGone(kickOffTime: Date, halfLength: number, halfOffset: number) {
        //if(!kickOffTime) return;
        const t: Date = new Date(kickOffTime);
        const now: Date = new Date();
        const diffTime: number = (now.getTime() - t.getTime()) / 60000;
        const minutes = Math.min(parseInt(diffTime.toString()), halfLength);
        const seconds = minutes >= halfLength ? 0 : parseInt(((diffTime - minutes) * 60).toString());

        const overtimeMinutes = parseInt(diffTime.toString()) - minutes;
        const overtimeSeconds = parseInt(((diffTime - minutes - overtimeMinutes) * 60).toString());
        let overtimeString = '';
        if (minutes >= halfLength) {
            const overtimeLeadingZero = overtimeSeconds < 10 ? '0' : '';
            overtimeString = ` + ${overtimeMinutes}:${overtimeLeadingZero}${overtimeSeconds}`;
        }

        const leadingZero = seconds < 10 ? '0' : '';
        return `${minutes + halfOffset}:${leadingZero}${seconds}${overtimeString}`;

    }

    function calculateEventTimeGone(kickOffTime: Date, halfOffset: number): number {

        const now: Date = new Date();
        const diffTime: number = (now.getTime() - kickOffTime.getTime()) / 60000;
        return diffTime + halfOffset;

    }

    const updateMatch = (match: Match) => {
        localStorage.setItem(`match${match.id}`, JSON.stringify(match));
        setMatch(match);
    }

    const updateTimeGone = useCallback(
        () => {

            if (match.halfTime && !match.kickOffTime2ndHalf) {
                setMatchStatus('SECONDHALF');
                return setTimeGone('H-T');
            }
            if (match.fullTime) {
                setMatchStatus('MATCHENDED');
                return setTimeGone('F-T');
            }

            if (match.kickOffTime2ndHalf) {
                setMatchStatus('FULLTIME');
                return setTimeGone(calculateTimeGone(match.kickOffTime2ndHalf, match.halfLength, match.halfLength));
            }

            if (match.kickOffTime) {
                setMatchStatus('HALFTIME');
                return setTimeGone(calculateTimeGone(match.kickOffTime, match.halfLength, 0));
            }
            setMatchStatus('KICKOFF');

            const matchDate = new Date(match.matchDate);
            return setTimeGone(matchDate.toLocaleString());
        }, [match.kickOffTime, match.halfTime, match.fullTime, match.kickOffTime2ndHalf, match.halfLength, match.matchDate]);

    const matchEvent = () => {
        switch (matchStatus) {
            case 'KICKOFF':
                const koMatch = match;
                koMatch.kickOffTime = new Date();
                updateMatch(koMatch);
                setMatchStatus('HALFTIME');
                setTimeGone('0:00');
                updateTimeGone();
                break;
            case 'HALFTIME':
                const htMatch = match;
                htMatch.halfTime = new Date();
                updateMatch(htMatch);
                setMatchStatus('SECONDHALF');
                updateTimeGone();
                break;
            case 'SECONDHALF':
                const shMatch = match;
                shMatch.kickOffTime2ndHalf = new Date();
                updateMatch(shMatch);
                setMatchStatus('FULLTIME');
                setTimeGone('0:00');
                updateTimeGone();
                break;
            case 'FULLTIME':
                const ftMatch = match;
                ftMatch.fullTime = new Date();
                updateMatch(ftMatch);
                setMatchStatus('MATCHENDED');
                updateTimeGone();
                break;

        }
    }

    const goalScored = () => {

        setGoalScoredStatus('CHOOSETEAM');
        if (match.kickOffTime2ndHalf)
            return setGoalScoredTime(calculateEventTimeGone(match.kickOffTime2ndHalf, match.halfLength));

        if (match.kickOffTime)
            return setGoalScoredTime(calculateEventTimeGone(match.kickOffTime, 0));


    }

    const goalTeam = (team: string) => {
        setGoalScoredStatus('CHOOSEPLAYER');
        setGoalScoredTeam(team);
    }

    const goalPlayer = (player: string) => {
        goalScoredTeam === 'WCFC' ? setGoalScoredStatus('CHOOSEASSIST') : setGoalScoredStatus('SAVEGOAL');
        setGoalScoredPlayer(player);
    }

    const goalAssist = (player: string) => {
        setGoalScoredStatus('SAVEGOAL');
        setGoalScoredAssist(player);
    }

    const saveGoal = () => {

        const thisMatch = match;

        const scorer: Event = {
            player: goalScoredPlayer,
            time: goalScoredTime
        }

        const assister: Event = {
            player: goalScoredAssist,
            time: goalScoredTime
        }

        switch (goalScoredTeam) {
            case 'WCFC':
                thisMatch.wcfcScore += 1;
                thisMatch.wcfcScorers.push(scorer);
                if (assister.player.length > 0) {
                    thisMatch.wcfcAssists.push(assister);
                }
                updateMatch(thisMatch);
                break;
            case match.opponent:
                thisMatch.opponentScore += 1;
                thisMatch.opponentScorers.push(scorer);
                updateMatch(thisMatch);
                break;
        }
        setGoalScoredStatus('INPLAY');

        setGoalScoredTime(0);
        setGoalScoredAssist('');
        setGoalScoredPlayer('');
        setGoalScoredTeam('');

    }
    
    const goalCheck = () =>{

        const assistedWording = goalScoredAssist.length > 0 ? `, assisted by ${goalScoredAssist}` : '';

        return `Goal for ${goalScoredTeam} at ${parseInt(Math.ceil(goalScoredTime).toString())} by ${goalScoredPlayer}${assistedWording}.`;
    }

    const cancelGoal = () => {
        setGoalScoredStatus('INPLAY');
    };

    useEffect(() => {
        setTimeout(updateTimeGone, 1000);
    }, [updateTimeGone, timeGone]);

    //     useEffect(() =>{
    // updateTimeGone();
    //     }, [match]);

    return (
        <>
            <div className="row">
                <div className='text-center fs-2'>
                    {timeGone}
                </div>
                <ScoreCard team='WCFC Greens' score={match.wcfcScore} scorers={match.wcfcScorers} assists={match.wcfcAssists} />
                <ScoreCard team={match.opponent} score={match.opponentScore} scorers={match.opponentScorers} />
            </div>
            <div className="row mt-5">
                {matchStatus !== 'MATCHENDED' &&
                    <div className='d-grid align-items-center gap-2'>
                        {(matchStatus !== 'KICKOFF' && matchStatus !== 'SECONDHALF') &&
                            <button className='btn btn-success' onClick={() => goalScored()}>GOAL</button>
                        }
                        <button className='btn btn-success' onClick={() => matchEvent()}>{matchStatus}</button>
                    </div>
                }
                {goalScoredStatus === 'CHOOSETEAM' &&
                    <div className='grid mt-2 gap-2'>
                        <h2>Team</h2>
                        <button className='btn btn-success col-6' onClick={() => goalTeam('WCFC')}>WCFC</button>
                        <button className='btn btn-danger col-6' onClick={() => goalTeam(match.opponent)}>{match.opponent}</button>
                    </div>
                }
                {goalScoredStatus === 'CHOOSEPLAYER' && goalScoredTeam === 'WCFC' &&
                    <div className='d-grid mt-2 gap-2'>
                        <h2>Scorer</h2>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success' onClick={() => goalPlayer('Own Goal')}>Own Goal</button>
                            <div className='grid gap-2'>
                                {squad.map(player => {
                                    return (
                                        <button key={squad.indexOf(player)} className='btn btn-outline-success col-4' onClick={() => goalPlayer(player)}>{player}</button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
                {goalScoredStatus === 'CHOOSEPLAYER' && goalScoredTeam === match.opponent &&
                    <div className='d-grid mt-2 gap-2'>
                        <h2>Scorer</h2>
                        <button className='btn btn-success' onClick={() => goalPlayer('Own Goal')}>Own Goal</button>
                        <input className='form-control' type='number' onChange={(e) => setOppositionScorer(e.target.value)} />
                        <button className='btn btn-success' onClick={() => goalPlayer(oppositionScorer)}>GO</button>
                    </div>
                }
                {goalScoredStatus === 'CHOOSEASSIST' && goalScoredTeam === 'WCFC' &&
                    <div className='d-grid mt-2 gap-2'>
                        <h2>Assisted By</h2>
                        <button className='btn btn-success' onClick={() => goalAssist('')}>No Assist</button>
                        <div className='grid gap-2'>
                            {squad.map(player => {
                                return (
                                    <button key={squad.indexOf(player)} className='btn btn-outline-success col-4' onClick={() => goalAssist(player)}>{player}</button>
                                )
                            })}
                        </div>
                    </div>
                }
                {goalScoredStatus === 'SAVEGOAL' &&
                    <div className='d-grid mt-3 gy-2'>
                        <h5>{goalCheck()}</h5>
                        <button className='btn btn-success' onClick={() => saveGoal()}>SAVE GOAL</button>
                    </div>
                }
                {goalScoredStatus !== 'INPLAY' &&
                    <div className='d-grid gy-2'>
                        <button className='btn btn-secondary' onClick={() => cancelGoal()}>CANCEL</button>
                    </div>
                }
            </div>
        </>
    );

}

interface MatchProps {
    match: Match;
    setMatch: Function;
    squad: string[]
}