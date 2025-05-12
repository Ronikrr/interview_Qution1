import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

const User = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const onSubmit = () => {
    if (!newTask.trim()) return;
    const newTaskObject = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = { ...updated[editIndex], text: newTask };
      setTasks(updated);
      handleSaveToLocalStorage(updated);
      setEditIndex(null);
    } else {
      const updated = [...tasks, newTaskObject];
      setTasks(updated);
      handleSaveToLocalStorage(updated);
    }

    setNewTask("");
  };

  const handleSaveToLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  const toggleTask = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
    handleSaveToLocalStorage(updated);
  };
  const onDelete = (id) => {
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);
    handleSaveToLocalStorage(updated);
  };
  const onEdit = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditIndex(tasks.findIndex((t) => t.id === id));
    }
  };
  const filters = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Task Manager</h2>
      <Row className="mb-3 justify-content-center">
        <Col sm={6} className="">
          <Form>
            <Form.Control
              type="text"
              className="mb-4"
              placeholder="Enter task title"
              name="title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button onClick={onSubmit} variant="primary">
              {editIndex !== null ? "Update" : "Add"}
            </Button>
          </Form>
        </Col>
      </Row>
      <ButtonGroup className="mb-4">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "secondary"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "uncompleted" ? "primary" : "secondary"}
          onClick={() => setFilter("uncompleted")}
        >
          Uncompleted
        </Button>
      </ButtonGroup>
      {filters.map((d) => (
        <InputGroup key={d.id} className="mb-2">
          <InputGroup.Checkbox
            checked={d.completed}
            onChange={() => toggleTask(d.id)}
          />
          <Form.Control value={d.text} readOnly />
          <Button variant="danger" onClick={() => onDelete(d.id)}>
            Delete
          </Button>

          <Button variant="light" onClick={() => onEdit(d.id)}>
            edit
          </Button>
        </InputGroup>
      ))}
    </Container>
  );
};

export default User;
