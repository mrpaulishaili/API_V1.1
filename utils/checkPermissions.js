import CustomError from "../errors";

export const checkPermissions = (requestUser, resourceUserId) => {
  //! console.log(requestUser);
  console.log(resourceUserId.toString());
  // console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};
