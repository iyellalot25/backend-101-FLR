//In-Memory Dummy tasks
const DUMMY_TASKS = [
  {
    id: 1,
    title: "Buy groceries",
    done: false,
  },
  {
    id: 2,
    title: "Walk the dog",
    done: true,
  },
  {
    id: 3,
    title: "Read a book",
    done: false,
  },
];

const tasks = [...DUMMY_TASKS];

module.exports = {
  tasks,
};
