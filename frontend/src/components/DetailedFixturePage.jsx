import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const DetailedFixturePage = () => {
  const { id } = useParams();
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtureDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/fixtures/details/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch fixture details');
        }
        const data = await response.json();
        setFixture(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchFixtureDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderPlayerLink = (player) => (
    <Link to={`/player-match-detail/${fixture.id}/${player}`}>{player}</Link>
  );

  return (
    <div>
      <h1>Detailed Fixture</h1>
      <div>
        <h2>{fixture.home_club} {fixture.home_score} - {fixture.away_score} {fixture.away_club}</h2>
        <p>Full Time</p>
        <p>{renderPlayerLink('Marcus Rashford')} (23), {renderPlayerLink('Anthony Martial')} (78) {renderPlayerLink('Sadio Mane')} (45)</p>
        <hr />
        <p>{fixture.home_club} [{fixture.home_club_formation}] vs {fixture.away_club} [{fixture.away_club_formation}]</p>
        <p>Manager: {fixture.home_club_manager} vs {fixture.away_club_manager}</p>
        <p>Starting 11: {fixture.home_starting_11.split(', ').map(renderPlayerLink).reduce((prev, curr) => [prev, ', ', curr])}</p>
        <p>Bench: {fixture.home_bench.split(', ').map(renderPlayerLink).reduce((prev, curr) => [prev, ', ', curr])}</p>
        <p>Possession: {fixture.home_possession}%</p>
        <p>Shots: {fixture.home_shots}</p>
        <p>Shots on target: {fixture.home_shots_on_target}</p>
        <p>Passes: {fixture.home_passes}</p>
        <p>Tackles: {fixture.home_tackles}</p>
        <p>Saves: {fixture.home_saves}</p>
        <p>Fouls Committed: {fixture.home_fouls_committed}</p>
        <p>Corners: {fixture.home_corners}</p>
        <p>Offsides: {fixture.home_offsides}</p>
        <p>Free Kicks: {fixture.home_free_kicks}</p>
        <p>Penalty Kicks: {fixture.home_penalty_kicks}</p>
        <p>Yellow Cards: {fixture.home_yellow_cards}</p>
        <p>Red Cards: {fixture.home_red_cards}</p>
        <p>Possession: {fixture.away_possession}%</p>
        <p>Shots: {fixture.away_shots}</p>
        <p>Shots on target: {fixture.away_shots_on_target}</p>
        <p>Passes: {fixture.away_passes}</p>
        <p>Tackles: {fixture.away_tackles}</p>
        <p>Saves: {fixture.away_saves}</p>
        <p>Fouls Committed: {fixture.away_fouls_committed}</p>
        <p>Corners: {fixture.away_corners}</p>
        <p>Offsides: {fixture.away_offsides}</p>
        <p>Free Kicks: {fixture.away_free_kicks}</p>
        <p>Penalty Kicks: {fixture.away_penalty_kicks}</p>
        <p>Yellow Cards: {fixture.away_yellow_cards}</p>
        <p>Red Cards: {fixture.away_red_cards}</p>
        <p>Date: {fixture.match_date}</p>
        <p>Stadium: {fixture.stadium}</p>
        <p>Referee: {fixture.referee}</p>
      </div>
    </div>
  );
};

export default DetailedFixturePage;
