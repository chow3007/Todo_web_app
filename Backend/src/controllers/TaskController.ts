import { Request, Response } from "express";
import Task from "../models/Task.js";

export const createTask = async (req: Request, res: Response) => {
    const {title, discription, status } = req.body;
  const task = await Task.create({title, discription, status});
 res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
};

export const getTasks = async ( _req: Request, res: Response) => {
  const tasks = await Task.findAll();
  res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks
    });
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    await Task.update(req.body, { where: { id } });

    const updatedTask = await Task.findByPk(id);

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Task.destroy({ where: { id } });
   res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
};
