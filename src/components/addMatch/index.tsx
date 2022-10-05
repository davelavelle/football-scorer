import React, { useEffect, useCallback, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Match from '../../types/match';

export default function AddMatchCard({ id, saveToList, cancel }: AddMatchCardProps) {

    const [opponent, setOpponent] = useState<string>('');
    const [halfLength, setHalfLength] = useState<number>(30);
    const [matchDate, setMatchDate] = useState<Date>(new Date());

    const cancelAddMatch = () => {
        cancel();
    }

    const saveMatch = () => {
        debugger;
        const newMatch: Match = {
            id: id,
            opponent: opponent,
            halfLength: halfLength,
            matchDate: matchDate,
            location: 'HOME',
            opponentScore: 0,
            wcfcScore: 0,
            squad: [],
            wcfcAssists: [],
            wcfcScorers: [],
            opponentScorers: []
        }
        localStorage.setItem(`match${newMatch.id}`, JSON.stringify(newMatch));
        saveToList(id, `${opponent} - ${matchDate.toLocaleString()}`)
    }

    return (
        <>
            <button className='btn btn-secondary' onClick={() => cancelAddMatch()} >CANCEL</button>
            <form onSubmit={() => saveMatch()}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor='opponent'>Opponent</label>
                    <input type='text' id='opponent' className='form-control' onChange={(e) => setOpponent(e.target.value)} value={opponent}></input>
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor='opponent'>Half Length</label>
                    <input type='number' id='halfLength' className='form-control' onChange={(e) => setHalfLength(parseInt(e.target.value))} value={halfLength}></input>
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor='matchDate'>Match Date & Time</label>
                    <DateTimePicker className='form-control' onChange={setMatchDate} value={matchDate} />
                </div>
                <button className='btn btn-primary' type='submit'>ADD</button>
            </form>
        </>
    )
}

interface AddMatchCardProps {
    id: number;
    saveToList: Function;
    cancel: Function;
}