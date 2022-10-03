import React from 'react';
import './index.css';

import Event from '../../types/event'
export default function ScoreCard({ team, score, scorers, assists }: ScoreCardProps) {

    const scorerList = () => {
        const x = scorers.map(scorer => { 
            const assister : Event | undefined = assists?.find(x=>x.time === scorer.time);
            if(assister) return `${scorer.player} (${scorer.time} - ${assister.player})`;
            return `${scorer.player} (${scorer.time})`;
        });
        return x;
    }

    return (
        <div className='col-sm score-card'>
            <div className='row'>
                <div className='col-9'>
                    {team}
                </div>
                <div className='col-3 text-end'>
                    {score}
                </div>
                <div className='col-12 scorers'>
                    {scorerList().join(', ')}
                </div>
            </div>
        </div>
    )
}

interface ScoreCardProps {
    team: string;
    score: number;
    scorers: Event[];
    assists?: Event[] | undefined;
}