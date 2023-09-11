## Running React on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool that includes features like Hot Module Reloading (HMR), optimized builds, and TypeScript support out of the box.

Using the two in conjunction is one of the fastest ways to build a web app.

## TailwindCss

To compile you must run the following command.
```sh
npx tailwindcss -i ./src/App.css -o ./dist/stylecss --watch
```
having serious issues with tailwind not compiling classes.

### Getting Started
- Hit run
- Edit [App.tsx](#src/App.tsx) and watch it live update!

By default, Replit runs the `dev` script, but you can configure it by changing the `run` field in the [configuration file](#.replit). Here are the vite docs for [serving production websites](https://vitejs.dev/guide/build.html)

##  Design

The goal of this project is to be a flash card tool for building up groupings of concepts, mastering those concepts, then becoming fluent with those concepts. This concept is based on the research-based fluency system called SAFMEDS (Say-All-Fast-Minute-Every-Day-Shuffled).

- [Research Study on SAFMEDS](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6701507/)
- [More Info on SAFMEDS](https://bmcmededuc.biomedcentral.com/articles/10.1186/s12909-020-02021-8)

At its most basic level this app should have users, groupings of concepts, concepts with a scoring metric for determining mastery, and a fluency system. The fluency system will require shuffling of selected concepts (sets), a timer to measure the rate of accurate responses per minute. 

## User Stories

As a user I want to make a new set (group of cards), give the set a name, and add flashcard concepts to the set. I would like to be able to edit the cards, order them by dragging, and delete cards.

## TODOs

- [ ] add a page to show a list of card sets
- [ ]   add functionally to that page to add/edit set
- [ ] add a page to show list of concepts
- [ ]   a concept list item shows q, a, set name
- [ ]   clicking on a concept turns it into edit mode
- [ ] add a page to test concepts
- [ ]   the play view should have a single large card
