import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';


export const TeamPage = () => {

  const { team, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('myTeamData');
    return {
      // team: Teams.findOne(),
      isLoading: !handler.ready(),
    };
  });

  if (isLoading) return <p>Loading team...</p>;

  return (
    <div>
      <h2>Team Dashboard</h2>
      <p>This is a separate route!</p>
    </div>
  );
};