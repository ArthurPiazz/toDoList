import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";
import { Random } from "meteor/random";
import { Accounts } from 'meteor/accounts-base';


const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: "Do the Tutorial",
      url: "https://docs.meteor.com/tutorials/react/",
    });

    await insertLink({
      title: "Follow the Guide",
      url: "https://docs.meteor.com/tutorials/application-structure/",
    });

    await insertLink({
      title: "Read the Docs",
      url: "https://docs.meteor.com",
    });

    await insertLink({
      title: "Discussions",
      url: "https://forums.meteor.com",
    });

    await insertLink({
      title: "Join us on Discord",
      url: "https://discord.gg/6mS3wHNg",
    });

    await insertLink({
      title: "Deploying in Galaxy",
      url: "https://www.meteor.com/hosting",
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});

Meteor.methods({
  about() {
    return `This is a Meteor application running React with React Router. this is a generated id: ${Random.id()}`;
  },
});
