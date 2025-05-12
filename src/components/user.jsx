import { useState } from "react";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    Card,
    Alert,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const User = () => {
    const [Tasks, setTasks] = useState(() => {
        const stored = localStorage.getItem("Tasks");
        return stored ? JSON.parse(stored) : [];
    });
    const [newtask, setnewtask] = useState("");
    const [editindex, seteditindex] = useState(null);
    const [filter, setfilter] = useState("all");
    const [alertMessage, setAlertMessage] = useState("");

    const onSubmit = () => {
        if (!newtask.trim()) return;

        const newtaskObject = {
            id: Date.now(),
            text: newtask,
            completed: false,
        };

        let updatedTasks;
        if (editindex !== null) {
            updatedTasks = [...Tasks];
            updatedTasks[editindex] = { ...updatedTasks[editindex], text: newtask };
            setAlertMessage("Task updated successfully!");
            seteditindex(null);
        } else {
            updatedTasks = [...Tasks, newtaskObject];
            setAlertMessage("Task added successfully!");
        }

        setTasks(updatedTasks);
        SaveLocalStorage(updatedTasks);
        setnewtask("");
    };

    const SaveLocalStorage = (updatedTasks) => {
        localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    };

    const toggleTask = (id) => {
        const updated = Tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updated);
        SaveLocalStorage(updated);
    };

    const ondelete = (id) => {
        const updated = Tasks.filter((task) => task.id !== id);
        setTasks(updated);
        SaveLocalStorage(updated);
        setAlertMessage("Task deleted successfully!");
    };

    const onedit = (id) => {
        const taskToEdit = Tasks.find((task) => task.id === id);
        if (taskToEdit) {
            setnewtask(taskToEdit.text);
            seteditindex(Tasks.findIndex((t) => t.id === id));
        }
    };

    const filters = Tasks.filter((task) => {
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

            {/* Alert message */}
            {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

            <Row className="mb-3 justify-content-center">
                <Col sm={6}>
                    <Form>
                        <Form.Control
                            type="text"
                            className="mb-4"
                            placeholder="Enter task title"
                            name="title"
                            value={newtask}
                            onChange={(e) => setnewtask(e.target.value)}
                        />
                        <Button onClick={onSubmit} variant="primary" block>
                            {editindex !== null ? "Update Task" : "Add Task"}
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Filter buttons */}
            <ButtonGroup className="mb-4 d-flex justify-content-center">
                <Button
                    variant={filter === "all" ? "primary" : "outline-primary"}
                    onClick={() => setfilter("all")}
                >
                    All
                </Button>
                <Button
                    variant={filter === "completed" ? "primary" : "outline-primary"}
                    onClick={() => setfilter("completed")}
                >
                    Completed
                </Button>
                <Button
                    variant={filter === "uncompleted" ? "primary" : "outline-primary"}
                    onClick={() => setfilter("uncompleted")}
                >
                    Uncompleted
                </Button>
            </ButtonGroup>

            {/* Task List */}
            {filters.map((task) => (
                <Card key={task.id} className="mb-3">
                    <Card.Body>
                        <InputGroup>
                            <InputGroup.Checkbox
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                aria-label="Complete task"
                            />
                            <Form.Control
                                value={task.text}
                                readOnly
                                className={task.completed ? "text-muted text-decoration-line-through" : ""}
                            />
                            <Button variant="danger" onClick={() => ondelete(task.id)}>
                                <FaTrashAlt />
                            </Button>
                            <Button variant="light" onClick={() => onedit(task.id)}>
                                <FaEdit />
                            </Button>
                        </InputGroup>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default User;
