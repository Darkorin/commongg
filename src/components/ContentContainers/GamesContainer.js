import React, { useEffect, useState } from 'react';
import GameCard from "../GameCard.js";
import TeamfightTactics from "../../images/games/Teamfight Tactics.jpg";
import CommonChat from "../../images/games/Common Chat.png";

function GamesContainer(props) {
    const [modalState, setModalState] = useState("show d-block");
    const [selectedGames, setSelectedGames] = useState([]);
    const [gamesArr, setGamesArr] = useState([]);
    const [allGames, setAllGames] = useState([
        {
            title: "Common Chat",
            image: CommonChat
        },
        {
            title: "Teamfight Tactics",
            image: TeamfightTactics
        }
    ]);

    useEffect(() => {
        setGamesArr(allGames.map((game, i) => {
            return <GameCard key={i} gameTitle={game.title} gameImageSrc={game.image} index={i} selectedGames={selectedGames} setSelectedGames={setSelectedGames} />;
        }));
    }, [allGames]);

    function handleDoneClick() {
        setModalState("d-none");
        props.storeUserGames(selectedGames);
    }

    return (
        <div className="ChooseGames" >
            <div className="container">
                <div className="row">
                    <div className={`modal fade ${modalState}`} id="chooseGamesModal" tabIndex="-1" role="dialog" aria-labelledby="chooseGameModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="chooseGameModalLabel">edit your games</h5>
                                </div>
                                <div className="row">{gamesArr}</div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="button" className="btn btn-primary" onClick={handleDoneClick}>done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamesContainer;