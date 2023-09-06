import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchTasks = async () => {
  const response = await axios.get("http://localhost:1226/task");
  return response.data;
};

const deleteTasks = async (task_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:1226/task/" + task_id,
  });
  return response.data;
};

export default function Task() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: tasks,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
  });

  const memoryTasks = queryClient.getQueryData(["tasks"]);
  const priorityOptions = useMemo(() => {
    let options = [];
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if (!options.includes(task.priority)) {
          options.push(task.priority);
        }
      });
    }
    return options;
  }, [memoryTasks]);

  const deleteMutation = useMutation({
    mutationFn: deleteTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      notifications.show({
        title: "Item Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="center">
        <Title order={3} align="center">
          Task Scheduler
        </Title>
        <Button
          component={Link}
          to="/add_task"
          variant="gradient"
          gradient={{ from: "yellow", to: "purple", deg: 105 }}
        >
          Add New Tasks
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>
                <Group position="right">Actions</Group>
              </th>
            </tr>
          </thead>{" "}
          {tasks ? (
            tasks.map((task) => {
              return (
                <tbody>
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{task.category.name}</td>
                    <td>
                      <Group position="right">
                        <Button
                          component={Link}
                          to={"/task_edit/" + task._id}
                          color="blue"
                          size="xs"
                          radius="5px"
                        >
                          Edit
                        </Button>
                        <Button
                          color="red"
                          size="xs"
                          radius="5px"
                          onClick={() => {
                            deleteMutation.mutate(task._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Group>
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <Grid.Col className="mt-5">
              <Space h="120px" />
              <h1 className="text-center text-muted">No List yet .</h1>
            </Grid.Col>
          )}
        </Table>
      </Grid>
    </>
  );
}
