import { useState, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  TextInput,
  Divider,
  Button,
  Group,
  LoadingOverlay,
  Table,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getTask = async (id) => {
  const response = await axios.get("http://localhost:1226/task/" + id);
  return response.data;
};

const updateTask = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:1226/task/" + id,
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function TasksEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const { isLoading, data } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getTask(id),
    onSuccess: (data) => {
      setTitle(data.title);
      setDescription(data.description);
      setDueDate(data.dueDate);
      setStatus(data.status);
      setPriority(data.priority);
      setCategory(data.category);
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

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      notifications.show({
        title: "Task Edited",
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

  const handleUpdateTask = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        title: title,
        description: description,
        dueDate: dueDate,
        status: status,
        priority: priority,
        category: category,
      }),
    });
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={3} align="center">
        Edit Task
      </Title>
      <Space h="50px" />
      <Table horizontalSpacing="xl" verticalSpacing="md" fontSize="md">
        <LoadingOverlay visible={isLoading} />
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
          placeholder="Enter the task due date here"
          label="dueDate"
          description="The due date of the task"
          withAsterisk
          onChange={(event) => setDueDate(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={status}
          placeholder="Enter the task status here"
          label="Status"
          description="The status of the task"
          withAsterisk
          onChange={(event) => setStatus(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the task priority here"
          label="Priority"
          description="The priority of the task"
          withAsterisk
          onChange={(event) => setPriority(event.target.value)}
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
        {/* <TextInput
          value={category}
          placeholder="Enter the task category here"
          label="Category"
          description="The category of the task"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
        /> */}
        <Space h="20px" />
        <Button fullwidth onClick={handleUpdateTask}>
          Update
        </Button>
      </Table>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="20px" />
    </Container>
  );
}

export default TasksEdit;
