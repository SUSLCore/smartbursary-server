import { Request, Response } from "express";
import { Faculty, Department } from "../models";

export const getFaculties = async (req: Request, res: Response) => {
  const faculties = await Faculty.findAll();
  res.json(faculties);
};

export const getDepartmentsByFaculty = async (req: Request, res: Response) => {
  const { facultyId } = req.params;

  const departments = await Department.findAll({
    where: { facultyId },
  });

  res.json(departments);
};