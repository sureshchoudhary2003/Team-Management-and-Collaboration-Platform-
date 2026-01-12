import {
  TaskPriorityEnum,
  TaskStatusEnum,
} from '../constant';
import { parseAsString, useQueryStates } from "nuqs";

/*
  This hook keeps the task-table filters in the URL query-string using `nuqs`.
  It returns a tuple: `[filters, setFilters]` just like React useState.
  Each filter is serialised as a simple string value (comma-separated for multi-select).
*/
export default function useTaskTableFilter() {
  const [filters, setFilters] = useQueryStates({
    status: parseAsString.withDefault(""),
    priority: parseAsString.withDefault(""),
    keyword: parseAsString.withDefault(""),
    projectId: parseAsString.withDefault(""),
    assigneeId: parseAsString.withDefault(""),
  });

  return [filters, setFilters];
}
