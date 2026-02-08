import axios from "axios";
import { GradeAssignmentPayload, Submission, UngradedAssignmentSubmission } from "@/Models/Submission";

export const fetchCourseSubmissionsAPI = async (
  courseId: number,
): Promise<Submission[]> => {
  const res = await axios.get(
    "http://localhost:8080/staff/filter/submissions",
    {
      params: { courseId },
    },
  );
  return res.data;
};

export const fetchUngradedAssignmentSubmissionsAPI = async (
  assignmentId: string | number,
): Promise<UngradedAssignmentSubmission[]> => {
  const { data } = await axios.get(
    `http://localhost:8080/staff/get/all/ungraded/assignment/submissions`,
    {
      params: { assignmentId },
    },
  );
  return data;
};

export const fetchAllUngradedAssignmentSubmissionsAPI = async (
  courseId: number,
): Promise<UngradedAssignmentSubmission[]> => {
  // First, get all submissions for the course
  const allSubmissions = await fetchCourseSubmissionsAPI(courseId);

  // Filter to only ungraded assignments
  const ungradedAssignments = allSubmissions.filter(
    (sub) =>
      sub.submissionType === "ASSIGNMENT" &&
      sub.submissionStatus === "UNGRADED",
  );

  // Get unique targetIds
  const uniqueTargetIds = [
    ...new Set(ungradedAssignments.map((sub) => sub.targetId)),
  ];

  // Fetch detailed submissions for each unique targetId
  const detailedSubmissionsPromises = uniqueTargetIds.map((targetId) =>
    fetchUngradedAssignmentSubmissionsAPI(targetId),
  );

  const detailedSubmissionsArrays = await Promise.all(
    detailedSubmissionsPromises,
  );

  // Flatten the array of arrays into a single array
  return detailedSubmissionsArrays.flat();
};


export const gradeAssignmentSubmissionAPI = async (
  payload: GradeAssignmentPayload,
): Promise<void> => {
  await axios.post(
    "http://localhost:8080/staff/submission/grade/assignments",
    payload,
  );
};