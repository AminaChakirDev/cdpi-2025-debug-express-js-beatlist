import { body, param } from "express-validator";

export const validatePlaylistBody = [
  body("title")
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 2, max: 150 })
    .withMessage(
      "Le titre doit faire au moins 2 caractères et ne peut pas dépasser 150 caractères",
    ),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La description ne peut pas dépasser 500 caractères"),
  body("is_public")
    .optional()
    .isBoolean()
    .withMessage("is_public doit être un booléen"),
];

export const validatePlaylistId = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];
