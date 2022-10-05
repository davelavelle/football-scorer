import React, { useState } from 'react';
//["Alfie","Amr","Evan","Lewis","Sam","Corey","Jake","Fin","Kyran","Cameron","Cole","Robbie","Jayden","Mason","Jason"]
export default function SquadCard({ squad, setSquad }: SquadCardProps) {
    const [newPlayer, setNewPlayer] = useState<string>('');

    const deletePlayer = (index: number) => {
        let savedPlayers = localStorage.getItem('squad') ?? '[]';
        const savedPlayersArray = JSON.parse(savedPlayers);
        savedPlayersArray.splice(index, 1);
        localStorage.setItem('squad', JSON.stringify(savedPlayersArray));
        setSquad(savedPlayersArray);
    }

    const addPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayer || newPlayer.length === 0 || squad.indexOf(newPlayer) > 0) {
            return;
        }
        let savedPlayersString = localStorage.getItem('squad') ?? '[]';
        const savedPlayers = JSON.parse(savedPlayersString);
        savedPlayers.push(newPlayer);
        localStorage.setItem('squad', JSON.stringify(savedPlayers));
        setSquad(savedPlayers);
        setNewPlayer('');

    }

    return (
        <div className='d-grid gap-2'>
            {(squad.length > 0 && !(squad.length === 1 && squad[0] === '')) &&
                <div className='d-grid'>
                    {squad.map(player => {
                        return (
                            <div className='input-group' key={squad.indexOf(player)}>
                                <span className='input-group-text w-5 text-right'>{squad.indexOf(player) + 1}.</span>
                                <input className='form-control' type='text' value={player} disabled />
                                <button className='btn btn-outline-danger' type='submit' onClick={() => deletePlayer(squad.indexOf(player))} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                </svg> Delete</button>
                            </div>
                        )
                    })}
                </div>
            }
            <form id='form1' className="input-group" onSubmit={addPlayer} >
                <input type="text" value={newPlayer} className="form-control" onChange={(e) => { setNewPlayer(e.target.value) }} />
                {/* <input className='btn btn-primary' type='submit' value="ADD" /> */}
                <button className='btn btn-primary' form='form1' type='submit' >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                    </svg>&nbsp;
                    ADD</button>

            </form>
        </div>
    )

}

interface SquadCardProps {
    squad: string[];
    setSquad: Function;
}