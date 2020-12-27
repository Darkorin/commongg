import React, { useState, useRef, Fragment } from 'react';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Link } from "react-router-dom";
import TeamfightTactics from "../images/games/Teamfight Tactics.jpg";
import CommonChat from "../images/games/Common Chat.png";

const AsyncTypeahead = withAsync(Typeahead);

function SearchBox(props) {

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
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

  const inputStyle = {
    border: "none",
    width: "100%"
  }

  //the users from search results get passed in
  const afterSearch = (users, query) => {
    let options = [{name: "users", type: "label"}]
    options = options.concat(Object.values(users).map((user, i) => ({
      avatar_url: user.profile_picture,
      id: Object.keys(users)[i],
      name: user.username,
      type: "user"
    })));
    options.push({name: "games", type: "label"})
    const gameResult = searchGames(query);
    //might introduce issue when a person's name is same as game's name
    options = options.concat(gameResult.map((game, i) => ({
      image: game.image,
      name: game.title,
      type: "game"
    })));
    setOptions(options);
    setIsLoading(false);
  }

  //search games based on query
  const searchGames = (query) => {
    console.log("search games");
    console.log(query)
    let result = allGames.filter((game) => {
      //check if query is in the title
      return game.title.toLowerCase().includes(query.toLowerCase());
    });
    console.log(result)
    return result;
  }

  const handleSearch = (query) => {
    console.log(query);
    setIsLoading(true);
    props.search(query, afterSearch, query);
  };

  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="searchBox"
      isLoading={isLoading}
      labelKey="name"
      minLength={3}
      onSearch={handleSearch}
      options={options}
      placeholder="search"
      style={inputStyle}
      renderMenuItemChildren={(option, props) => (
        <Fragment>
          {option.type==="user" && <Link to={"/profile/" + option.id }>
            <img
              alt={option.name}
              src={option.avatar_url}
              style={{
                borderRadius: '25px',
                height: '24px',
                marginRight: '10px',
                width: '24px',
              }}
            />
            <span style={{color: "white"}}>{option.name}</span>
          </Link>}
          {option.type==="game" && <Link to={"/games/" + option.name.split(" ").join('').toLowerCase() }>
            <img
              alt={option.title}
              src={option.image}
              style={{
                borderRadius: '25px',
                height: '24px',
                marginRight: '10px',
                width: '24px',
              }}
            />
            <span style={{color: "white"}}>{option.name}</span>
          </Link>}
          {option.type==="label" && 
            <span style={{color: "white"}}>{option.name}</span>
          }
        </Fragment>
      )}
    />
  );
}

export default SearchBox;
