# AI Battle

Chess AI Battle is an open source project that allows you to write your own chess AI and have it play against other people AIs. You can publish your own AI into the repository.

# Running your own server

You can download and run your own server. It uses NodeJS and MySQL that needs to be installed before hand (and npm). Once you gace it run the following commants

```
git clone https://github.com/vitmalina/ai-battle
npm install
```

Edit api/_conf.js file and enter your data base connection information. Then open setup/db.sql and run it agains your MySQL database. You can optionally run data.sql for sample user data.

```
npm start
```