import reducer, { addTask, updateTask, deleteTask, setTasks, Task } from "./slice";

const initialState = {
  tasks: []
};

describe("task reducer", () => {

  test("should set tasks", () => {
    const tasks: Task[] = [
      { id: 1, title: "Task 1", discription: "Desc 1", status: "yet" },
      { id: 2, title: "Task 2", discription: "Desc 2", status: "ongoing" },
    ];

    const state = reducer(initialState, setTasks(tasks));

    expect(state.tasks.length).toBe(2);
    expect(state.tasks[0].title).toBe("Task 1");
    expect(state.tasks[1].status).toBe("ongoing");
  });

  test("should add task", () => {
    const task = { id: 1, title: "Test", discription: "Hello", status: "yet" as const };

    const state = reducer(initialState, addTask(task));

    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0].title).toBe("Test");
  });

  test("should update task", () => {
    const startState = {
      tasks: [{ id: 1, title: "Old", discription: "", status: "yet" as const }]
    };

    const state = reducer(startState, updateTask({
      id: 1,
      title: "New",
      discription: "",
      status: "ongoing" as const
    }));

    expect(state.tasks[0].title).toBe("New");
    expect(state.tasks[0].status).toBe("ongoing");
  });

  test("should delete task", () => {
    const startState = {
      tasks: [{ id: 1, title: "Task", discription: "", status: "yet" as const }]
    };

    const state = reducer(startState, deleteTask(1));

    expect(state.tasks.length).toBe(0);
  });

});
