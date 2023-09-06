import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getCategory = async (id) => {
  const response = await axios.get("http://localhost:1226/category/" + id);
  return response.data;
};

const addTasks = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:1226/task",
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function TasksAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const { data } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategory(id),
    onSuccess: (data) => {
      setCategory(data.name);
    },
  });

  const memoryCategories = queryClient.getQueryData(["categories", ""]);
  const categoryOptions = useMemo(() => {
    let options = [];
    if (memoryCategories && memoryCategories.length > 0) {
      memoryCategories.forEach((category) => {
        if (!options.includes(category)) {
          options.push(category);
        }
      });
    }
    return options;
  }, [memoryCategories]);

  const createMutation = useMutation({
    mutationFn: addTasks,
    onSuccess: () => {
      notifications.show({
        title: "Task Added",
        color: "green",
      });

      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewTasks = async (event) => {
    event.preventDefault();
    createMutation.mutate(
      JSON.stringify({
        title: title,
        description: description,
        dueDate: dueDate,
        status: status,
        priority: priority,
        category: category,
      })
    );
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Task
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={title}
          placeholder="Enter the task title here"
          label="Title"
          description="The title of the task"
          withAsterisk
          onChange={(event) => setTitle(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={description}
          placeholder="Enter the task description here"
          label="Description"
          description="The description of the task"
          withAsterisk
          onChange={(event) => setDescription(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={dueDate}
          placeholder="Enter the due date here"
          label="Due date"
          description="The due date of the task"
          withAsterisk
          onChange={(event) => setDueDate(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the priority here"
          label="Priority"
          description="The priority of the task"
          withAsterisk
          onChange={(event) => setPriority(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={status}
          placeholder="Enter the status here"
          label="Status"
          description="The status of the task"
          withAsterisk
          onChange={(event) => setStatus(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value="">All categories</option>
          {categoryOptions.map((category) => {
            console.log(categoryOptions);
            return (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            );
          })}
        </select>
        <Space h="20px" />
        <Divider />
        <Button fullWidth onClick={handleAddNewTasks}>
          Add New Tasks
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}

export default TasksAdd;
