cricri®

## ツール
+ react
+ react-router
+ redux
+ material-ui
+ express
+ sequelize

## 使い方
1. `npm install`
2. `npm run <コマンド>`

## package.json: scripts のコマンド
`dev` - express, babel & nodemon  
`dev2`- react (prod) & express  
`start`- react (dev)  
`build` - react (prod)  

## ディレクトリ構成
+ bin/: express
+ build/: react build & express static file
+ config/: express
+ models/: sequelize
+ public/: ?
+ routes/: express router
+ src/: react
  + actions/: redux
  + components/: react
  + config/: react
  + reducers/: redux
  + store/: redux
  + utils/: react
  + App.js: react ルートコンポーネント
  + index.js: react エントリポイント
  + 他: 適当
+ utils/: express
+ views/: express view
+ app.js: express エントリポイント?
