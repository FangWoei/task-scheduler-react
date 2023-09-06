import { useState } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";

const getTask = async (id) => {
  const response = await axios.get("http://localhost:1226/task" + id);
  return response.data;
};

const addCategory = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:1226/category",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

function CategoryAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTask] = useState([]);
  const [name, setName] = useState("");
  const { data } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTask(id),
    onSuccess: (data) => {
      setTask(data.id);
    },
  });

  const createMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      notifications.show({
        title: "Category Added",
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

  const handleAddNewCategory = async (event) => {
    event.preventDefault();
    createMutation.mutate(
      JSON.stringify({
        tasks: tasks,
        name: name,
      })
    );
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Category
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the shop name here"
          label="Name"
          description="The name of the shop"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewCategory}>
          Add New Category
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
export default CategoryAdd;
