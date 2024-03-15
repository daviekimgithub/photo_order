# photo-order-react v2.0

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Repository Workflow Rules

The main branch is `main` - it triggers GitHub Actions, and the current version of the application goes to the `staging` environment.

Tasks are performed on a separate branch from `main` and merged into `main` at the end using a pull request.

A release to the production version is done by merging `main` into the `release` branch. Only in this direction, nothing goes directly to `release`. A separate GitHub Actions publishes the production version.

## Running the Staging Environment

Start the application with the `.env.staging` parameters.

You need to accept the lack of certificates for the staging environment (legacy app).
Open `https://staging.oistigmes.com/` - after accepting, you can close it.

In the running application, go to the address `localhost:3000/photographer/2320`.


## Links

photo-order PRD `https://oistigmes-react-ordering.azurewebsites.net`

photo-order STG `https://oistigmes-staging-web-ordering.azurewebsites.net`

oistigmes PRD `https://oistigmes.com/`

oistigmes STG `https://staging.oistigmes.com`

## Other
To learn React, check out the [React documentation](https://reactjs.org/).
