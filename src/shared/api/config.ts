import axios from "axios";
import {OpenAPI} from "./generated";

OpenAPI.BASE = "";
OpenAPI.WITH_CREDENTIALS = true;

axios.defaults.timeout = 10000;
