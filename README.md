## How to use

Start the application with the `yarn start` command. It will run on localhost:3000.
Test it with the `yarn test` command.
To run in it development mode, use the `yarn develop` command.

## Take Home Exercise

​

### Overview

​
Due to the nature of our teams work we deal a lot with the end-to-end development of consumer-facing tools either directly or by proxy of the platforms, frameworks, and libraries we create. The goal of this exercise is to create a fullstack, single-page, note-taking application in your JavaScript/NodeJS library and/or framework of choice. While we predominately use React please use something that you are confident and comfortable in. At a high-level this application should at a minimum support persistence to the filesystem with a fundamental requirement being when the application is restarted any notes created before the restart can still be accessed. There is no expectation of having a fully baked design or aesthetic and there is no expectation of polish -- the only expectation is that visible features be functional.
​

### Acceptance Criteria

​

- Pushed to Github or similar service and be either publically or privately cloneable.
- Includes both a frontend and backend that communicates via REST or GraphQL.
- Includes critical unit/functional test coverage for both the frontend and the backend code.
- Includes support for CREATE, READ, UPDATE, and DELETE operations.
- Frontend supports client-side routing/navigation (SPA) across notes and all supported operations.
- Backend supports direct retrieval of notes.
- Backend supports persistence of notes (e.g. flat-file, mysql, mongo).
- Application can be tested using `(npm|yarn) test`.
- Application can be started in "production" mode using `(npm|yarn) run start`.
- Application can be started in "development" mode using `(npm|yarn) run develop`.
- Stretch-Goal: Browser tests to facilitate E2E testing (e.g. TestCafe, Cypress).
- Stretch-Goal: Supports for request caching and busting (e.g. SWR).
- Stretch-Goal: Supports server-side rendering where/when applicable (e.g. React).
  ​

### Considerations

​

- Be prepared to discuss your rationale(s) for the descions made.
- If more time is needed do let us know, we're happy to accommodate any time constraints or extenuating circumstances where we can.
- If you are unable to complete an item in the acceptance criteria that is perfectly fine, however, be prepared to discuss what you would have done given enough time.

<!--

TODO:
wrap request provider class
error handling with toast
styled components?
Add a loader
prettier conf
eslint conf


 -->
