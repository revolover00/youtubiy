import { A as querystring, C as isBrowserExtension, D as isReactNative, E as isMobileCordova, S as getUA, T as isCloudflareWorker, _ as deepEqual, a as getApp, c as LogLevel, d as Deferred, f as ErrorFactory, g as createSubscribe, i as _registerComponent, j as querystringDecode, k as pingServer, l as Logger, m as base64Decode, n as _getProvider, p as FirebaseError, r as _isFirebaseServerApp, s as registerVersion, t as SDK_VERSION, u as Component, v as extractQuerystring, w as isCloudWorkstation, x as getModularInstance, y as getDefaultEmulatorHost } from "./@firebase/app+[...].mjs";
//#region node_modules/@firebase/auth/dist/node-esm/totp-BU9AvxK8.js
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _prodErrorMap() {
	return { ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK." };
}
/**
* A minimal error map with all verbose error messages stripped.
*
* See discussion at {@link AuthErrorMap}
*
* @public
*/
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var logClient = new Logger("@firebase/auth");
function _logWarn(msg, ...args) {
	if (logClient.logLevel <= LogLevel.WARN) logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
}
function _logError(msg, ...args) {
	if (logClient.logLevel <= LogLevel.ERROR) logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _fail(authOrCode, ...rest) {
	throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
	return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth, code, message) {
	const errorMap = {
		...prodErrorMap(),
		[code]: message
	};
	return new ErrorFactory("auth", "Firebase", errorMap).create(code, { appName: auth.name });
}
function _serverAppCurrentUserOperationNotSupportedError(auth) {
	return _errorWithCustomMessage(auth, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function createErrorInternal(authOrCode, ...rest) {
	if (typeof authOrCode !== "string") {
		const code = rest[0];
		const fullParams = [...rest.slice(1)];
		if (fullParams[0]) fullParams[0].appName = authOrCode.name;
		return authOrCode._errorFactory.create(code, ...fullParams);
	}
	return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
	if (!assertion) throw createErrorInternal(authOrCode, ...rest);
}
/**
* Unconditionally fails, throwing an internal error with the given message.
*
* @param failure type of failure encountered
* @throws Error
*/
function debugFail(failure) {
	const message = `INTERNAL ASSERTION FAILED: ` + failure;
	_logError(message);
	throw new Error(message);
}
/**
* Fails if the given assertion condition is false, throwing an Error with the
* given message if it did.
*
* @param assertion
* @param message
*/
function debugAssert(assertion, message) {
	if (!assertion) debugFail(message);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _isHttpOrHttps() {
	return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _getCurrentScheme() {
	return typeof self !== "undefined" && self.location?.protocol || null;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Determine whether the browser is working online
*/
function _isOnline() {
	if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) return navigator.onLine;
	return true;
}
function _getUserLanguage() {
	if (typeof navigator === "undefined") return null;
	const navigatorLanguage = navigator;
	return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A structure to help pick between a range of long and short delay durations
* depending on the current environment. In general, the long delay is used for
* mobile environments whereas short delays are used for desktop environments.
*/
var Delay = class {
	constructor(shortDelay, longDelay) {
		this.shortDelay = shortDelay;
		this.longDelay = longDelay;
		debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
		this.isMobile = isMobileCordova() || isReactNative();
	}
	get() {
		if (!_isOnline()) return Math.min(5e3, this.shortDelay);
		return this.isMobile ? this.longDelay : this.shortDelay;
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _emulatorUrl(config, path) {
	debugAssert(config.emulator, "Emulator should always be set here");
	const { url } = config.emulator;
	if (!path) return url;
	return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var FetchProvider = class {
	static initialize(fetchImpl, headersImpl, responseImpl) {
		this.fetchImpl = fetchImpl;
		if (headersImpl) this.headersImpl = headersImpl;
		if (responseImpl) this.responseImpl = responseImpl;
	}
	static fetch() {
		if (this.fetchImpl) return this.fetchImpl;
		if (typeof self !== "undefined" && "fetch" in self) return self.fetch;
		if (typeof globalThis !== "undefined" && globalThis.fetch) return globalThis.fetch;
		if (typeof fetch !== "undefined") return fetch;
		debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
	static headers() {
		if (this.headersImpl) return this.headersImpl;
		if (typeof self !== "undefined" && "Headers" in self) return self.Headers;
		if (typeof globalThis !== "undefined" && globalThis.Headers) return globalThis.Headers;
		if (typeof Headers !== "undefined") return Headers;
		debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
	static response() {
		if (this.responseImpl) return this.responseImpl;
		if (typeof self !== "undefined" && "Response" in self) return self.Response;
		if (typeof globalThis !== "undefined" && globalThis.Response) return globalThis.Response;
		if (typeof Response !== "undefined") return Response;
		debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Map from errors returned by the server to errors to developer visible errors
*/
var SERVER_ERROR_MAP = {
	["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
	["MISSING_CUSTOM_TOKEN"]: "internal-error",
	["INVALID_IDENTIFIER"]: "invalid-email",
	["MISSING_CONTINUE_URI"]: "internal-error",
	["INVALID_PASSWORD"]: "wrong-password",
	["MISSING_PASSWORD"]: "missing-password",
	["INVALID_LOGIN_CREDENTIALS"]: "invalid-credential",
	["EMAIL_EXISTS"]: "email-already-in-use",
	["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
	["INVALID_IDP_RESPONSE"]: "invalid-credential",
	["INVALID_PENDING_TOKEN"]: "invalid-credential",
	["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
	["MISSING_REQ_TYPE"]: "internal-error",
	["EMAIL_NOT_FOUND"]: "user-not-found",
	["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
	["EXPIRED_OOB_CODE"]: "expired-action-code",
	["INVALID_OOB_CODE"]: "invalid-action-code",
	["MISSING_OOB_CODE"]: "internal-error",
	["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
	["INVALID_ID_TOKEN"]: "invalid-user-token",
	["TOKEN_EXPIRED"]: "user-token-expired",
	["USER_NOT_FOUND"]: "user-token-expired",
	["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
	["PASSWORD_DOES_NOT_MEET_REQUIREMENTS"]: "password-does-not-meet-requirements",
	["INVALID_CODE"]: "invalid-verification-code",
	["INVALID_SESSION_INFO"]: "invalid-verification-id",
	["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
	["MISSING_SESSION_INFO"]: "missing-verification-id",
	["SESSION_EXPIRED"]: "code-expired",
	["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
	["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
	["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
	["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
	["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
	["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
	["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
	["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
	["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
	["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
	["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error",
	["RECAPTCHA_NOT_ENABLED"]: "recaptcha-not-enabled",
	["MISSING_RECAPTCHA_TOKEN"]: "missing-recaptcha-token",
	["INVALID_RECAPTCHA_TOKEN"]: "invalid-recaptcha-token",
	["INVALID_RECAPTCHA_ACTION"]: "invalid-recaptcha-action",
	["MISSING_CLIENT_TYPE"]: "missing-client-type",
	["MISSING_RECAPTCHA_VERSION"]: "missing-recaptcha-version",
	["INVALID_RECAPTCHA_VERSION"]: "invalid-recaptcha-version",
	["INVALID_REQ_TYPE"]: "invalid-req-type"
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var CookieAuthProxiedEndpoints = [
	"/v1/accounts:signInWithCustomToken",
	"/v1/accounts:signInWithEmailLink",
	"/v1/accounts:signInWithIdp",
	"/v1/accounts:signInWithPassword",
	"/v1/accounts:signInWithPhoneNumber",
	"/v1/token"
];
var DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
function _addTidIfNecessary(auth, request) {
	if (auth.tenantId && !request.tenantId) return {
		...request,
		tenantId: auth.tenantId
	};
	return request;
}
async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
	return _performFetchWithErrorHandling(auth, customErrorMap, async () => {
		let body = {};
		let params = {};
		if (request) if (method === "GET") params = request;
		else body = { body: JSON.stringify(request) };
		const query = querystring({
			...params,
			key: auth.config.apiKey
		}).slice(1);
		const headers = await auth._getAdditionalHeaders();
		headers["Content-Type"] = "application/json";
		if (auth.languageCode) headers["X-Firebase-Locale"] = auth.languageCode;
		const fetchArgs = {
			method,
			headers,
			...body
		};
		if (!isCloudflareWorker()) fetchArgs.referrerPolicy = "strict-origin-when-cross-origin";
		if (auth.emulatorConfig && isCloudWorkstation(auth.emulatorConfig.host)) fetchArgs.credentials = "include";
		return FetchProvider.fetch()(await _getFinalTarget(auth, auth.config.apiHost, path, query), fetchArgs);
	});
}
async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
	auth._canInitEmulator = false;
	const errorMap = {
		...SERVER_ERROR_MAP,
		...customErrorMap
	};
	try {
		const networkTimeout = new NetworkTimeout(auth);
		const response = await Promise.race([fetchFn(), networkTimeout.promise]);
		networkTimeout.clearNetworkTimeout();
		const json = await response.json();
		if ("needConfirmation" in json) throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
		if (response.ok && !("errorMessage" in json)) return json;
		else {
			const [serverErrorCode, serverErrorMessage] = (response.ok ? json.errorMessage : json.error.message).split(" : ");
			if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") throw _makeTaggedError(auth, "credential-already-in-use", json);
			else if (serverErrorCode === "EMAIL_EXISTS") throw _makeTaggedError(auth, "email-already-in-use", json);
			else if (serverErrorCode === "USER_DISABLED") throw _makeTaggedError(auth, "user-disabled", json);
			const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
			if (serverErrorMessage) throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
			else _fail(auth, authError);
		}
	} catch (e) {
		if (e instanceof FirebaseError) throw e;
		_fail(auth, "network-request-failed", { "message": String(e) });
	}
}
async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
	const serverResponse = await _performApiRequest(auth, method, path, request, customErrorMap);
	if ("mfaPendingCredential" in serverResponse) _fail(auth, "multi-factor-auth-required", { _serverResponse: serverResponse });
	return serverResponse;
}
async function _getFinalTarget(auth, host, path, query) {
	const base = `${host}${path}?${query}`;
	const authInternal = auth;
	const finalTarget = authInternal.config.emulator ? _emulatorUrl(auth.config, base) : `${auth.config.apiScheme}://${base}`;
	if (CookieAuthProxiedEndpoints.includes(path)) {
		await authInternal._persistenceManagerAvailable;
		if (authInternal._getPersistenceType() === "COOKIE") return authInternal._getPersistence()._getFinalTarget(finalTarget).toString();
	}
	return finalTarget;
}
function _parseEnforcementState(enforcementStateStr) {
	switch (enforcementStateStr) {
		case "ENFORCE": return "ENFORCE";
		case "AUDIT": return "AUDIT";
		case "OFF": return "OFF";
		default: return "ENFORCEMENT_STATE_UNSPECIFIED";
	}
}
var NetworkTimeout = class {
	clearNetworkTimeout() {
		clearTimeout(this.timer);
	}
	constructor(auth) {
		this.auth = auth;
		this.timer = null;
		this.promise = new Promise((_, reject) => {
			this.timer = setTimeout(() => {
				return reject(_createError(this.auth, "network-request-failed"));
			}, DEFAULT_API_TIMEOUT_MS.get());
		});
	}
};
function _makeTaggedError(auth, code, response) {
	const errorParams = { appName: auth.name };
	if (response.email) errorParams.email = response.email;
	if (response.phoneNumber) errorParams.phoneNumber = response.phoneNumber;
	const error = _createError(auth, code, errorParams);
	error.customData._tokenResponse = response;
	return error;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function isEnterprise(grecaptcha) {
	return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
}
var RecaptchaConfig = class {
	constructor(response) {
		/**
		* The reCAPTCHA site key.
		*/
		this.siteKey = "";
		/**
		* The list of providers and their enablement status for reCAPTCHA Enterprise.
		*/
		this.recaptchaEnforcementState = [];
		if (response.recaptchaKey === void 0) throw new Error("recaptchaKey undefined");
		this.siteKey = response.recaptchaKey.split("/")[3];
		this.recaptchaEnforcementState = response.recaptchaEnforcementState;
	}
	/**
	* Returns the reCAPTCHA Enterprise enforcement state for the given provider.
	*
	* @param providerStr - The provider whose enforcement state is to be returned.
	* @returns The reCAPTCHA Enterprise enforcement state for the given provider.
	*/
	getProviderEnforcementState(providerStr) {
		if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) return null;
		for (const recaptchaEnforcementState of this.recaptchaEnforcementState) if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
		return null;
	}
	/**
	* Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
	*
	* @param providerStr - The provider whose enablement state is to be returned.
	* @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
	*/
	isProviderEnabled(providerStr) {
		return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
	}
	/**
	* Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
	* returns false.
	*
	* @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
	*/
	isAnyProviderEnabled() {
		return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER") || this.isProviderEnabled("PHONE_PROVIDER");
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function getRecaptchaConfig(auth, request) {
	return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function deleteAccount(auth, request) {
	return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
}
async function getAccountInfo(auth, request) {
	return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function utcTimestampToDateString(utcTimestamp) {
	if (!utcTimestamp) return;
	try {
		const date = new Date(Number(utcTimestamp));
		if (!isNaN(date.getTime())) return date.toUTCString();
	} catch (e) {}
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Returns a deserialized JSON Web Token (JWT) used to identify the user to a Firebase service.
*
* @remarks
* Returns the current token if it has not expired or if it will not expire in the next five
* minutes. Otherwise, this will refresh the token and return a new one.
*
* @param user - The user.
* @param forceRefresh - Force refresh regardless of token expiration.
*
* @public
*/
async function getIdTokenResult(user, forceRefresh = false) {
	const userInternal = getModularInstance(user);
	const token = await userInternal.getIdToken(forceRefresh);
	const claims = _parseToken(token);
	_assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
	const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
	const signInProvider = firebase?.["sign_in_provider"];
	return {
		claims,
		token,
		authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
		issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
		expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
		signInProvider: signInProvider || null,
		signInSecondFactor: firebase?.["sign_in_second_factor"] || null
	};
}
function secondsStringToMilliseconds(seconds) {
	return Number(seconds) * 1e3;
}
function _parseToken(token) {
	const [algorithm, payload, signature] = token.split(".");
	if (algorithm === void 0 || payload === void 0 || signature === void 0) {
		_logError("JWT malformed, contained fewer than 3 sections");
		return null;
	}
	try {
		const decoded = base64Decode(payload);
		if (!decoded) {
			_logError("Failed to decode base64 JWT payload");
			return null;
		}
		return JSON.parse(decoded);
	} catch (e) {
		_logError("Caught error parsing JWT payload as JSON", e?.toString());
		return null;
	}
}
/**
* Extract expiresIn TTL from a token by subtracting the expiration from the issuance.
*/
function _tokenExpiresIn(token) {
	const parsedToken = _parseToken(token);
	_assert(parsedToken, "internal-error");
	_assert(typeof parsedToken.exp !== "undefined", "internal-error");
	_assert(typeof parsedToken.iat !== "undefined", "internal-error");
	return Number(parsedToken.exp) - Number(parsedToken.iat);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
	if (bypassAuthState) return promise;
	try {
		return await promise;
	} catch (e) {
		if (e instanceof FirebaseError && isUserInvalidated(e)) {
			if (user.auth.currentUser === user) await user.auth.signOut();
		}
		throw e;
	}
}
function isUserInvalidated({ code }) {
	return code === `auth/user-disabled` || code === `auth/user-token-expired`;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ProactiveRefresh = class {
	constructor(user) {
		this.user = user;
		this.isRunning = false;
		this.timerId = null;
		this.errorBackoff = 3e4;
	}
	_start() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.schedule();
	}
	_stop() {
		if (!this.isRunning) return;
		this.isRunning = false;
		if (this.timerId !== null) clearTimeout(this.timerId);
	}
	getInterval(wasError) {
		if (wasError) {
			const interval = this.errorBackoff;
			this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4);
			return interval;
		} else {
			this.errorBackoff = 3e4;
			const interval = (this.user.stsTokenManager.expirationTime ?? 0) - Date.now() - 3e5;
			return Math.max(0, interval);
		}
	}
	schedule(wasError = false) {
		if (!this.isRunning) return;
		const interval = this.getInterval(wasError);
		this.timerId = setTimeout(async () => {
			await this.iteration();
		}, interval);
	}
	async iteration() {
		try {
			await this.user.getIdToken(true);
		} catch (e) {
			if (e?.code === `auth/network-request-failed`) this.schedule(true);
			return;
		}
		this.schedule();
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var UserMetadata = class {
	constructor(createdAt, lastLoginAt) {
		this.createdAt = createdAt;
		this.lastLoginAt = lastLoginAt;
		this._initializeTime();
	}
	_initializeTime() {
		this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
		this.creationTime = utcTimestampToDateString(this.createdAt);
	}
	_copy(metadata) {
		this.createdAt = metadata.createdAt;
		this.lastLoginAt = metadata.lastLoginAt;
		this._initializeTime();
	}
	toJSON() {
		return {
			createdAt: this.createdAt,
			lastLoginAt: this.lastLoginAt
		};
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function _reloadWithoutSaving(user) {
	const auth = user.auth;
	const response = await _logoutIfInvalidated(user, getAccountInfo(auth, { idToken: await user.getIdToken() }));
	_assert(response?.users.length, auth, "internal-error");
	const coreAccount = response.users[0];
	user._notifyReloadListener(coreAccount);
	const newProviderData = coreAccount.providerUserInfo?.length ? extractProviderData(coreAccount.providerUserInfo) : [];
	const providerData = mergeProviderData(user.providerData, newProviderData);
	const oldIsAnonymous = user.isAnonymous;
	const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !providerData?.length;
	const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
	const updates = {
		uid: coreAccount.localId,
		displayName: coreAccount.displayName || null,
		photoURL: coreAccount.photoUrl || null,
		email: coreAccount.email || null,
		emailVerified: coreAccount.emailVerified || false,
		phoneNumber: coreAccount.phoneNumber || null,
		tenantId: coreAccount.tenantId || null,
		providerData,
		metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
		isAnonymous
	};
	Object.assign(user, updates);
}
/**
* Reloads user account data, if signed in.
*
* @param user - The user.
*
* @public
*/
async function reload(user) {
	const userInternal = getModularInstance(user);
	await _reloadWithoutSaving(userInternal);
	await userInternal.auth._persistUserIfCurrent(userInternal);
	userInternal.auth._notifyListenersIfCurrent(userInternal);
}
function mergeProviderData(original, newData) {
	return [...original.filter((o) => !newData.some((n) => n.providerId === o.providerId)), ...newData];
}
function extractProviderData(providers) {
	return providers.map(({ providerId, ...provider }) => {
		return {
			providerId,
			uid: provider.rawId || "",
			displayName: provider.displayName || null,
			email: provider.email || null,
			phoneNumber: provider.phoneNumber || null,
			photoURL: provider.photoUrl || null
		};
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function requestStsToken(auth, refreshToken) {
	const response = await _performFetchWithErrorHandling(auth, {}, async () => {
		const body = querystring({
			"grant_type": "refresh_token",
			"refresh_token": refreshToken
		}).slice(1);
		const { tokenApiHost, apiKey } = auth.config;
		const url = await _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
		const headers = await auth._getAdditionalHeaders();
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		const options = {
			method: "POST",
			headers,
			body
		};
		if (auth.emulatorConfig && isCloudWorkstation(auth.emulatorConfig.host)) options.credentials = "include";
		return FetchProvider.fetch()(url, options);
	});
	return {
		accessToken: response.access_token,
		expiresIn: response.expires_in,
		refreshToken: response.refresh_token
	};
}
async function revokeToken(auth, request) {
	return _performApiRequest(auth, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* We need to mark this class as internal explicitly to exclude it in the public typings, because
* it references AuthInternal which has a circular dependency with UserInternal.
*
* @internal
*/
var StsTokenManager = class StsTokenManager {
	constructor() {
		this.refreshToken = null;
		this.accessToken = null;
		this.expirationTime = null;
	}
	get isExpired() {
		return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
	}
	updateFromServerResponse(response) {
		_assert(response.idToken, "internal-error");
		_assert(typeof response.idToken !== "undefined", "internal-error");
		_assert(typeof response.refreshToken !== "undefined", "internal-error");
		const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
		this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
	}
	updateFromIdToken(idToken) {
		_assert(idToken.length !== 0, "internal-error");
		const expiresIn = _tokenExpiresIn(idToken);
		this.updateTokensAndExpiration(idToken, null, expiresIn);
	}
	async getToken(auth, forceRefresh = false) {
		if (!forceRefresh && this.accessToken && !this.isExpired) return this.accessToken;
		_assert(this.refreshToken, auth, "user-token-expired");
		if (this.refreshToken) {
			await this.refresh(auth, this.refreshToken);
			return this.accessToken;
		}
		return null;
	}
	clearRefreshToken() {
		this.refreshToken = null;
	}
	async refresh(auth, oldToken) {
		const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth, oldToken);
		this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
	}
	updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
		this.refreshToken = refreshToken || null;
		this.accessToken = accessToken || null;
		this.expirationTime = Date.now() + expiresInSec * 1e3;
	}
	static fromJSON(appName, object) {
		const { refreshToken, accessToken, expirationTime } = object;
		const manager = new StsTokenManager();
		if (refreshToken) {
			_assert(typeof refreshToken === "string", "internal-error", { appName });
			manager.refreshToken = refreshToken;
		}
		if (accessToken) {
			_assert(typeof accessToken === "string", "internal-error", { appName });
			manager.accessToken = accessToken;
		}
		if (expirationTime) {
			_assert(typeof expirationTime === "number", "internal-error", { appName });
			manager.expirationTime = expirationTime;
		}
		return manager;
	}
	toJSON() {
		return {
			refreshToken: this.refreshToken,
			accessToken: this.accessToken,
			expirationTime: this.expirationTime
		};
	}
	_assign(stsTokenManager) {
		this.accessToken = stsTokenManager.accessToken;
		this.refreshToken = stsTokenManager.refreshToken;
		this.expirationTime = stsTokenManager.expirationTime;
	}
	_clone() {
		return Object.assign(new StsTokenManager(), this.toJSON());
	}
	_performRefresh() {
		return debugFail("not implemented");
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function assertStringOrUndefined(assertion, appName) {
	_assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
}
var UserImpl = class UserImpl {
	constructor({ uid, auth, stsTokenManager, ...opt }) {
		this.providerId = "firebase";
		this.proactiveRefresh = new ProactiveRefresh(this);
		this.reloadUserInfo = null;
		this.reloadListener = null;
		this.uid = uid;
		this.auth = auth;
		this.stsTokenManager = stsTokenManager;
		this.accessToken = stsTokenManager.accessToken;
		this.displayName = opt.displayName || null;
		this.email = opt.email || null;
		this.emailVerified = opt.emailVerified || false;
		this.phoneNumber = opt.phoneNumber || null;
		this.photoURL = opt.photoURL || null;
		this.isAnonymous = opt.isAnonymous || false;
		this.tenantId = opt.tenantId || null;
		this.providerData = opt.providerData ? [...opt.providerData] : [];
		this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
	}
	async getIdToken(forceRefresh) {
		const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
		_assert(accessToken, this.auth, "internal-error");
		if (this.accessToken !== accessToken) {
			this.accessToken = accessToken;
			await this.auth._persistUserIfCurrent(this);
			this.auth._notifyListenersIfCurrent(this);
		}
		return accessToken;
	}
	getIdTokenResult(forceRefresh) {
		return getIdTokenResult(this, forceRefresh);
	}
	reload() {
		return reload(this);
	}
	_assign(user) {
		if (this === user) return;
		_assert(this.uid === user.uid, this.auth, "internal-error");
		this.displayName = user.displayName;
		this.photoURL = user.photoURL;
		this.email = user.email;
		this.emailVerified = user.emailVerified;
		this.phoneNumber = user.phoneNumber;
		this.isAnonymous = user.isAnonymous;
		this.tenantId = user.tenantId;
		this.providerData = user.providerData.map((userInfo) => ({ ...userInfo }));
		this.metadata._copy(user.metadata);
		this.stsTokenManager._assign(user.stsTokenManager);
	}
	_clone(auth) {
		const newUser = new UserImpl({
			...this,
			auth,
			stsTokenManager: this.stsTokenManager._clone()
		});
		newUser.metadata._copy(this.metadata);
		return newUser;
	}
	_onReload(callback) {
		_assert(!this.reloadListener, this.auth, "internal-error");
		this.reloadListener = callback;
		if (this.reloadUserInfo) {
			this._notifyReloadListener(this.reloadUserInfo);
			this.reloadUserInfo = null;
		}
	}
	_notifyReloadListener(userInfo) {
		if (this.reloadListener) this.reloadListener(userInfo);
		else this.reloadUserInfo = userInfo;
	}
	_startProactiveRefresh() {
		this.proactiveRefresh._start();
	}
	_stopProactiveRefresh() {
		this.proactiveRefresh._stop();
	}
	async _updateTokensIfNecessary(response, reload = false) {
		let tokensRefreshed = false;
		if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
			this.stsTokenManager.updateFromServerResponse(response);
			tokensRefreshed = true;
		}
		if (reload) await _reloadWithoutSaving(this);
		await this.auth._persistUserIfCurrent(this);
		if (tokensRefreshed) this.auth._notifyListenersIfCurrent(this);
	}
	async delete() {
		if (_isFirebaseServerApp(this.auth.app)) return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
		const idToken = await this.getIdToken();
		await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
		this.stsTokenManager.clearRefreshToken();
		return this.auth.signOut();
	}
	toJSON() {
		return {
			uid: this.uid,
			email: this.email || void 0,
			emailVerified: this.emailVerified,
			displayName: this.displayName || void 0,
			isAnonymous: this.isAnonymous,
			photoURL: this.photoURL || void 0,
			phoneNumber: this.phoneNumber || void 0,
			tenantId: this.tenantId || void 0,
			providerData: this.providerData.map((userInfo) => ({ ...userInfo })),
			stsTokenManager: this.stsTokenManager.toJSON(),
			_redirectEventId: this._redirectEventId,
			...this.metadata.toJSON(),
			apiKey: this.auth.config.apiKey,
			appName: this.auth.name
		};
	}
	get refreshToken() {
		return this.stsTokenManager.refreshToken || "";
	}
	static _fromJSON(auth, object) {
		const displayName = object.displayName ?? void 0;
		const email = object.email ?? void 0;
		const phoneNumber = object.phoneNumber ?? void 0;
		const photoURL = object.photoURL ?? void 0;
		const tenantId = object.tenantId ?? void 0;
		const _redirectEventId = object._redirectEventId ?? void 0;
		const createdAt = object.createdAt ?? void 0;
		const lastLoginAt = object.lastLoginAt ?? void 0;
		const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
		_assert(uid && plainObjectTokenManager, auth, "internal-error");
		const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
		_assert(typeof uid === "string", auth, "internal-error");
		assertStringOrUndefined(displayName, auth.name);
		assertStringOrUndefined(email, auth.name);
		_assert(typeof emailVerified === "boolean", auth, "internal-error");
		_assert(typeof isAnonymous === "boolean", auth, "internal-error");
		assertStringOrUndefined(phoneNumber, auth.name);
		assertStringOrUndefined(photoURL, auth.name);
		assertStringOrUndefined(tenantId, auth.name);
		assertStringOrUndefined(_redirectEventId, auth.name);
		assertStringOrUndefined(createdAt, auth.name);
		assertStringOrUndefined(lastLoginAt, auth.name);
		const user = new UserImpl({
			uid,
			auth,
			email,
			emailVerified,
			displayName,
			isAnonymous,
			photoURL,
			phoneNumber,
			tenantId,
			stsTokenManager,
			createdAt,
			lastLoginAt
		});
		if (providerData && Array.isArray(providerData)) user.providerData = providerData.map((userInfo) => ({ ...userInfo }));
		if (_redirectEventId) user._redirectEventId = _redirectEventId;
		return user;
	}
	/**
	* Initialize a User from an idToken server response
	* @param auth
	* @param idTokenResponse
	*/
	static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
		const stsTokenManager = new StsTokenManager();
		stsTokenManager.updateFromServerResponse(idTokenResponse);
		const user = new UserImpl({
			uid: idTokenResponse.localId,
			auth,
			stsTokenManager,
			isAnonymous
		});
		await _reloadWithoutSaving(user);
		return user;
	}
	/**
	* Initialize a User from an idToken server response
	* @param auth
	* @param idTokenResponse
	*/
	static async _fromGetAccountInfoResponse(auth, response, idToken) {
		const coreAccount = response.users[0];
		_assert(coreAccount.localId !== void 0, "internal-error");
		const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
		const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length;
		const stsTokenManager = new StsTokenManager();
		stsTokenManager.updateFromIdToken(idToken);
		const user = new UserImpl({
			uid: coreAccount.localId,
			auth,
			stsTokenManager,
			isAnonymous
		});
		const updates = {
			uid: coreAccount.localId,
			displayName: coreAccount.displayName || null,
			photoURL: coreAccount.photoUrl || null,
			email: coreAccount.email || null,
			emailVerified: coreAccount.emailVerified || false,
			phoneNumber: coreAccount.phoneNumber || null,
			tenantId: coreAccount.tenantId || null,
			providerData,
			metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
			isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length
		};
		Object.assign(user, updates);
		return user;
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var instanceCache = /* @__PURE__ */ new Map();
function _getInstance(cls) {
	debugAssert(cls instanceof Function, "Expected a class definition");
	let instance = instanceCache.get(cls);
	if (instance) {
		debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
		return instance;
	}
	instance = new cls();
	instanceCache.set(cls, instance);
	return instance;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var InMemoryPersistence = class {
	constructor() {
		this.type = "NONE";
		this.storage = {};
	}
	async _isAvailable() {
		return true;
	}
	async _set(key, value) {
		this.storage[key] = value;
	}
	async _get(key) {
		const value = this.storage[key];
		return value === void 0 ? null : value;
	}
	async _remove(key) {
		delete this.storage[key];
	}
	_addListener(_key, _listener) {}
	_removeListener(_key, _listener) {}
};
InMemoryPersistence.type = "NONE";
/**
* An implementation of {@link Persistence} of type 'NONE'.
*
* @public
*/
var inMemoryPersistence = InMemoryPersistence;
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _persistenceKeyName(key, apiKey, appName) {
	return `firebase:${key}:${apiKey}:${appName}`;
}
var PersistenceUserManager = class PersistenceUserManager {
	constructor(persistence, auth, userKey) {
		this.persistence = persistence;
		this.auth = auth;
		this.userKey = userKey;
		const { config, name } = this.auth;
		this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name);
		this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name);
		this.boundEventHandler = auth._onStorageEvent.bind(auth);
		try {
			this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
		} catch {}
	}
	setCurrentUser(user) {
		return this.persistence._set(this.fullUserKey, user.toJSON());
	}
	async getCurrentUser() {
		const blob = await this.persistence._get(this.fullUserKey);
		if (!blob) return null;
		if (typeof blob === "string") {
			const response = await getAccountInfo(this.auth, { idToken: blob }).catch(() => void 0);
			if (!response) return null;
			return UserImpl._fromGetAccountInfoResponse(this.auth, response, blob);
		}
		return UserImpl._fromJSON(this.auth, blob);
	}
	removeCurrentUser() {
		return this.persistence._remove(this.fullUserKey);
	}
	savePersistenceForRedirect() {
		return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
	}
	async setPersistence(newPersistence) {
		if (this.persistence === newPersistence) return;
		const currentUser = await this.getCurrentUser();
		await this.removeCurrentUser();
		this.persistence = newPersistence;
		if (currentUser) return this.setCurrentUser(currentUser);
	}
	delete() {
		try {
			this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
		} catch {}
	}
	static async create(auth, persistenceHierarchy, userKey = "authUser") {
		if (!persistenceHierarchy.length) return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
		const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
			try {
				if (await persistence._isAvailable()) return persistence;
			} catch {
				return;
			}
		}))).filter((persistence) => persistence);
		let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
		const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
		let userToMigrate = null;
		for (const persistence of persistenceHierarchy) try {
			const blob = await persistence._get(key);
			if (blob) {
				let user;
				if (typeof blob === "string") {
					const response = await getAccountInfo(auth, { idToken: blob }).catch(() => void 0);
					if (!response) break;
					user = await UserImpl._fromGetAccountInfoResponse(auth, response, blob);
				} else user = UserImpl._fromJSON(auth, blob);
				if (persistence !== selectedPersistence) userToMigrate = user;
				selectedPersistence = persistence;
				break;
			}
		} catch {}
		const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
		if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) return new PersistenceUserManager(selectedPersistence, auth, userKey);
		selectedPersistence = migrationHierarchy[0];
		if (userToMigrate) await selectedPersistence._set(key, userToMigrate.toJSON());
		await Promise.all(persistenceHierarchy.map(async (persistence) => {
			if (persistence !== selectedPersistence) try {
				await persistence._remove(key);
			} catch {}
		}));
		return new PersistenceUserManager(selectedPersistence, auth, userKey);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Determine the browser for the purposes of reporting usage to the API
*/
function _getBrowserName(userAgent) {
	const ua = userAgent.toLowerCase();
	if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) return "Opera";
	else if (_isIEMobile(ua)) return "IEMobile";
	else if (ua.includes("msie") || ua.includes("trident/")) return "IE";
	else if (ua.includes("edge/")) return "Edge";
	else if (_isFirefox(ua)) return "Firefox";
	else if (ua.includes("silk/")) return "Silk";
	else if (_isBlackBerry(ua)) return "Blackberry";
	else if (_isWebOS(ua)) return "Webos";
	else if (_isSafari(ua)) return "Safari";
	else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) return "Chrome";
	else if (_isAndroid(ua)) return "Android";
	else {
		const matches = userAgent.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);
		if (matches?.length === 2) return matches[1];
	}
	return "Other";
}
function _isFirefox(ua = getUA()) {
	return /firefox\//i.test(ua);
}
function _isSafari(userAgent = getUA()) {
	const ua = userAgent.toLowerCase();
	return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
}
function _isChromeIOS(ua = getUA()) {
	return /crios\//i.test(ua);
}
function _isIEMobile(ua = getUA()) {
	return /iemobile/i.test(ua);
}
function _isAndroid(ua = getUA()) {
	return /android/i.test(ua);
}
function _isBlackBerry(ua = getUA()) {
	return /blackberry/i.test(ua);
}
function _isWebOS(ua = getUA()) {
	return /webos/i.test(ua);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function _getClientVersion(clientPlatform, frameworks = []) {
	let reportedPlatform;
	switch (clientPlatform) {
		case "Browser":
			reportedPlatform = _getBrowserName(getUA());
			break;
		case "Worker":
			reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
			break;
		default: reportedPlatform = clientPlatform;
	}
	const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
	return `${reportedPlatform}/JsCore/${SDK_VERSION}/${reportedFrameworks}`;
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var AuthMiddlewareQueue = class {
	constructor(auth) {
		this.auth = auth;
		this.queue = [];
	}
	pushCallback(callback, onAbort) {
		const wrappedCallback = (user) => new Promise((resolve, reject) => {
			try {
				resolve(callback(user));
			} catch (e) {
				reject(e);
			}
		});
		wrappedCallback.onAbort = onAbort;
		this.queue.push(wrappedCallback);
		const index = this.queue.length - 1;
		return () => {
			this.queue[index] = () => Promise.resolve();
		};
	}
	async runMiddleware(nextUser) {
		if (this.auth.currentUser === nextUser) return;
		const onAbortStack = [];
		try {
			for (const beforeStateCallback of this.queue) {
				await beforeStateCallback(nextUser);
				if (beforeStateCallback.onAbort) onAbortStack.push(beforeStateCallback.onAbort);
			}
		} catch (e) {
			onAbortStack.reverse();
			for (const onAbort of onAbortStack) try {
				onAbort();
			} catch (_) {}
			throw this.auth._errorFactory.create("login-blocked", { originalMessage: e?.message });
		}
	}
};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Fetches the password policy for the currently set tenant or the project if no tenant is set.
*
* @param auth Auth object.
* @param request Password policy request.
* @returns Password policy response.
*/
async function _getPasswordPolicy(auth, request = {}) {
	return _performApiRequest(auth, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MINIMUM_MIN_PASSWORD_LENGTH = 6;
/**
* Stores password policy requirements and provides password validation against the policy.
*
* @internal
*/
var PasswordPolicyImpl = class {
	constructor(response) {
		const responseOptions = response.customStrengthOptions;
		this.customStrengthOptions = {};
		this.customStrengthOptions.minPasswordLength = responseOptions.minPasswordLength ?? MINIMUM_MIN_PASSWORD_LENGTH;
		if (responseOptions.maxPasswordLength) this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
		if (responseOptions.containsLowercaseCharacter !== void 0) this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
		if (responseOptions.containsUppercaseCharacter !== void 0) this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
		if (responseOptions.containsNumericCharacter !== void 0) this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
		if (responseOptions.containsNonAlphanumericCharacter !== void 0) this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
		this.enforcementState = response.enforcementState;
		if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") this.enforcementState = "OFF";
		this.allowedNonAlphanumericCharacters = response.allowedNonAlphanumericCharacters?.join("") ?? "";
		this.forceUpgradeOnSignin = response.forceUpgradeOnSignin ?? false;
		this.schemaVersion = response.schemaVersion;
	}
	validatePassword(password) {
		const status = {
			isValid: true,
			passwordPolicy: this
		};
		this.validatePasswordLengthOptions(password, status);
		this.validatePasswordCharacterOptions(password, status);
		status.isValid && (status.isValid = status.meetsMinPasswordLength ?? true);
		status.isValid && (status.isValid = status.meetsMaxPasswordLength ?? true);
		status.isValid && (status.isValid = status.containsLowercaseLetter ?? true);
		status.isValid && (status.isValid = status.containsUppercaseLetter ?? true);
		status.isValid && (status.isValid = status.containsNumericCharacter ?? true);
		status.isValid && (status.isValid = status.containsNonAlphanumericCharacter ?? true);
		return status;
	}
	/**
	* Validates that the password meets the length options for the policy.
	*
	* @param password Password to validate.
	* @param status Validation status.
	*/
	validatePasswordLengthOptions(password, status) {
		const minPasswordLength = this.customStrengthOptions.minPasswordLength;
		const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
		if (minPasswordLength) status.meetsMinPasswordLength = password.length >= minPasswordLength;
		if (maxPasswordLength) status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
	}
	/**
	* Validates that the password meets the character options for the policy.
	*
	* @param password Password to validate.
	* @param status Validation status.
	*/
	validatePasswordCharacterOptions(password, status) {
		this.updatePasswordCharacterOptionsStatuses(status, false, false, false, false);
		let passwordChar;
		for (let i = 0; i < password.length; i++) {
			passwordChar = password.charAt(i);
			this.updatePasswordCharacterOptionsStatuses(status, passwordChar >= "a" && passwordChar <= "z", passwordChar >= "A" && passwordChar <= "Z", passwordChar >= "0" && passwordChar <= "9", this.allowedNonAlphanumericCharacters.includes(passwordChar));
		}
	}
	/**
	* Updates the running validation status with the statuses for the character options.
	* Expected to be called each time a character is processed to update each option status
	* based on the current character.
	*
	* @param status Validation status.
	* @param containsLowercaseCharacter Whether the character is a lowercase letter.
	* @param containsUppercaseCharacter Whether the character is an uppercase letter.
	* @param containsNumericCharacter Whether the character is a numeric character.
	* @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
	*/
	updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
		if (this.customStrengthOptions.containsLowercaseLetter) status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
		if (this.customStrengthOptions.containsUppercaseLetter) status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
		if (this.customStrengthOptions.containsNumericCharacter) status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
		if (this.customStrengthOptions.containsNonAlphanumericCharacter) status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var AuthImpl = class {
	constructor(app, heartbeatServiceProvider, appCheckServiceProvider, config) {
		this.app = app;
		this.heartbeatServiceProvider = heartbeatServiceProvider;
		this.appCheckServiceProvider = appCheckServiceProvider;
		this.config = config;
		this.currentUser = null;
		this.emulatorConfig = null;
		this.operations = Promise.resolve();
		this.authStateSubscription = new Subscription(this);
		this.idTokenSubscription = new Subscription(this);
		this.beforeStateQueue = new AuthMiddlewareQueue(this);
		this.redirectUser = null;
		this.isProactiveRefreshEnabled = false;
		this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
		this._canInitEmulator = true;
		this._isInitialized = false;
		this._deleted = false;
		this._initializationPromise = null;
		this._popupRedirectResolver = null;
		this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
		this._agentRecaptchaConfig = null;
		this._tenantRecaptchaConfigs = {};
		this._projectPasswordPolicy = null;
		this._tenantPasswordPolicies = {};
		this._resolvePersistenceManagerAvailable = void 0;
		this.lastNotifiedUid = void 0;
		this.languageCode = null;
		this.tenantId = null;
		this.settings = { appVerificationDisabledForTesting: false };
		this.frameworks = [];
		this.name = app.name;
		this.clientVersion = config.sdkClientVersion;
		this._persistenceManagerAvailable = new Promise((resolve) => this._resolvePersistenceManagerAvailable = resolve);
	}
	_initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
		if (popupRedirectResolver) this._popupRedirectResolver = _getInstance(popupRedirectResolver);
		this._initializationPromise = this.queue(async () => {
			if (this._deleted) return;
			try {
				this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
			} catch (e) {
				_logWarn(`Failed to initialize persistence: ${e}`);
				this.persistenceManager = await PersistenceUserManager.create(this, []);
			} finally {
				this._resolvePersistenceManagerAvailable?.();
			}
			if (this._deleted) return;
			if (this._popupRedirectResolver?._shouldInitProactively) try {
				await this._popupRedirectResolver._initialize(this);
			} catch (e) {}
			try {
				await this.initializeCurrentUser(popupRedirectResolver);
			} catch (e) {
				_logWarn(`Failed to initialize current user: ${e}`);
				await this.directlySetCurrentUser(null).catch(() => {});
			}
			this.lastNotifiedUid = this.currentUser?.uid || null;
			if (this._deleted) return;
			this._isInitialized = true;
		});
		return this._initializationPromise;
	}
	/**
	* If the persistence is changed in another window, the user manager will let us know
	*/
	async _onStorageEvent() {
		if (this._deleted) return;
		const user = await this.assertedPersistence.getCurrentUser();
		if (!this.currentUser && !user) return;
		if (this.currentUser && user && this.currentUser.uid === user.uid) {
			this._currentUser._assign(user);
			await this.currentUser.getIdToken();
			return;
		}
		await this._updateCurrentUser(user, true);
	}
	async initializeCurrentUserFromIdToken(idToken) {
		try {
			const response = await getAccountInfo(this, { idToken });
			const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
			await this.directlySetCurrentUser(user);
		} catch (err) {
			console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
			await this.directlySetCurrentUser(null);
		}
	}
	async initializeCurrentUser(popupRedirectResolver) {
		if (_isFirebaseServerApp(this.app)) {
			const idToken = this.app.settings.authIdToken;
			if (idToken) return new Promise((resolve) => {
				setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
			});
			else return this.directlySetCurrentUser(null);
		}
		const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
		let futureCurrentUser = previouslyStoredUser;
		let needsTocheckMiddleware = false;
		if (popupRedirectResolver && this.config.authDomain) {
			await this.getOrInitRedirectPersistenceManager();
			const redirectUserEventId = this.redirectUser?._redirectEventId;
			const storedUserEventId = futureCurrentUser?._redirectEventId;
			const result = await this.tryRedirectSignIn(popupRedirectResolver);
			if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && result?.user) {
				futureCurrentUser = result.user;
				needsTocheckMiddleware = true;
			}
		}
		if (!futureCurrentUser) return this.directlySetCurrentUser(null);
		if (!futureCurrentUser._redirectEventId) {
			if (needsTocheckMiddleware) try {
				await this.beforeStateQueue.runMiddleware(futureCurrentUser);
			} catch (e) {
				futureCurrentUser = previouslyStoredUser;
				this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
			}
			if (futureCurrentUser) return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
			else return this.directlySetCurrentUser(null);
		}
		_assert(this._popupRedirectResolver, this, "argument-error");
		await this.getOrInitRedirectPersistenceManager();
		if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) return this.directlySetCurrentUser(futureCurrentUser);
		return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
	}
	async tryRedirectSignIn(redirectResolver) {
		let result = null;
		try {
			result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
		} catch (e) {
			await this._setRedirectUser(null);
		}
		return result;
	}
	async reloadAndSetCurrentUserOrClear(user) {
		try {
			await _reloadWithoutSaving(user);
		} catch (e) {
			if (e?.code !== `auth/network-request-failed`) return this.directlySetCurrentUser(null);
		}
		return this.directlySetCurrentUser(user);
	}
	useDeviceLanguage() {
		this.languageCode = _getUserLanguage();
	}
	async _delete() {
		this._deleted = true;
	}
	async updateCurrentUser(userExtern) {
		if (_isFirebaseServerApp(this.app)) return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
		const user = userExtern ? getModularInstance(userExtern) : null;
		if (user) _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
		return this._updateCurrentUser(user && user._clone(this));
	}
	async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
		if (this._deleted) return;
		if (user) _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
		if (!skipBeforeStateCallbacks) await this.beforeStateQueue.runMiddleware(user);
		return this.queue(async () => {
			await this.directlySetCurrentUser(user);
			this.notifyAuthListeners();
		});
	}
	async signOut() {
		if (_isFirebaseServerApp(this.app)) return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
		await this.beforeStateQueue.runMiddleware(null);
		if (this.redirectPersistenceManager || this._popupRedirectResolver) await this._setRedirectUser(null);
		return this._updateCurrentUser(null, true);
	}
	setPersistence(persistence) {
		if (_isFirebaseServerApp(this.app)) return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
		return this.queue(async () => {
			await this.assertedPersistence.setPersistence(_getInstance(persistence));
		});
	}
	_getRecaptchaConfig() {
		if (this.tenantId == null) return this._agentRecaptchaConfig;
		else return this._tenantRecaptchaConfigs[this.tenantId];
	}
	async validatePassword(password) {
		if (!this._getPasswordPolicyInternal()) await this._updatePasswordPolicy();
		const passwordPolicy = this._getPasswordPolicyInternal();
		if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
		return passwordPolicy.validatePassword(password);
	}
	_getPasswordPolicyInternal() {
		if (this.tenantId === null) return this._projectPasswordPolicy;
		else return this._tenantPasswordPolicies[this.tenantId];
	}
	async _updatePasswordPolicy() {
		const passwordPolicy = new PasswordPolicyImpl(await _getPasswordPolicy(this));
		if (this.tenantId === null) this._projectPasswordPolicy = passwordPolicy;
		else this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
	}
	_getPersistenceType() {
		return this.assertedPersistence.persistence.type;
	}
	_getPersistence() {
		return this.assertedPersistence.persistence;
	}
	_updateErrorMap(errorMap) {
		this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
	}
	onAuthStateChanged(nextOrObserver, error, completed) {
		return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
	}
	beforeAuthStateChanged(callback, onAbort) {
		return this.beforeStateQueue.pushCallback(callback, onAbort);
	}
	onIdTokenChanged(nextOrObserver, error, completed) {
		return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
	}
	authStateReady() {
		return new Promise((resolve, reject) => {
			if (this.currentUser) resolve();
			else {
				const unsubscribe = this.onAuthStateChanged(() => {
					unsubscribe();
					resolve();
				}, reject);
			}
		});
	}
	/**
	* Revokes the given access token. Currently only supports Apple OAuth access tokens.
	*/
	async revokeAccessToken(token) {
		if (this.currentUser) {
			const request = {
				providerId: "apple.com",
				tokenType: "ACCESS_TOKEN",
				token,
				idToken: await this.currentUser.getIdToken()
			};
			if (this.tenantId != null) request.tenantId = this.tenantId;
			await revokeToken(this, request);
		}
	}
	toJSON() {
		return {
			apiKey: this.config.apiKey,
			authDomain: this.config.authDomain,
			appName: this.name,
			currentUser: this._currentUser?.toJSON()
		};
	}
	async _setRedirectUser(user, popupRedirectResolver) {
		const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
		return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
	}
	async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
		if (!this.redirectPersistenceManager) {
			const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
			_assert(resolver, this, "argument-error");
			this.redirectPersistenceManager = await PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser");
			this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
		}
		return this.redirectPersistenceManager;
	}
	async _redirectUserForId(id) {
		if (this._isInitialized) await this.queue(async () => {});
		if (this._currentUser?._redirectEventId === id) return this._currentUser;
		if (this.redirectUser?._redirectEventId === id) return this.redirectUser;
		return null;
	}
	async _persistUserIfCurrent(user) {
		if (user === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(user));
	}
	/** Notifies listeners only if the user is current */
	_notifyListenersIfCurrent(user) {
		if (user === this.currentUser) this.notifyAuthListeners();
	}
	_key() {
		return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
	}
	_startProactiveRefresh() {
		this.isProactiveRefreshEnabled = true;
		if (this.currentUser) this._currentUser._startProactiveRefresh();
	}
	_stopProactiveRefresh() {
		this.isProactiveRefreshEnabled = false;
		if (this.currentUser) this._currentUser._stopProactiveRefresh();
	}
	/** Returns the current user cast as the internal type */
	get _currentUser() {
		return this.currentUser;
	}
	notifyAuthListeners() {
		if (!this._isInitialized) return;
		this.idTokenSubscription.next(this.currentUser);
		const currentUid = this.currentUser?.uid ?? null;
		if (this.lastNotifiedUid !== currentUid) {
			this.lastNotifiedUid = currentUid;
			this.authStateSubscription.next(this.currentUser);
		}
	}
	registerStateListener(subscription, nextOrObserver, error, completed) {
		if (this._deleted) return () => {};
		const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
		let isUnsubscribed = false;
		const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
		_assert(promise, this, "internal-error");
		promise.then(() => {
			if (isUnsubscribed) return;
			cb(this.currentUser);
		}).catch((err) => {
			if (isUnsubscribed) return;
			if (typeof nextOrObserver !== "function" && nextOrObserver.error) nextOrObserver.error(err);
			else if (error) error(err);
			else throw err;
		});
		if (typeof nextOrObserver === "function") {
			const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
			return () => {
				isUnsubscribed = true;
				unsubscribe();
			};
		} else {
			const unsubscribe = subscription.addObserver(nextOrObserver);
			return () => {
				isUnsubscribed = true;
				unsubscribe();
			};
		}
	}
	/**
	* Unprotected (from race conditions) method to set the current user. This
	* should only be called from within a queued callback. This is necessary
	* because the queue shouldn't rely on another queued callback.
	*/
	async directlySetCurrentUser(user) {
		if (this.currentUser && this.currentUser !== user) this._currentUser._stopProactiveRefresh();
		if (user && this.isProactiveRefreshEnabled) user._startProactiveRefresh();
		this.currentUser = user;
		if (this.persistenceManager) try {
			if (user) await this.persistenceManager.setCurrentUser(user);
			else await this.persistenceManager.removeCurrentUser();
		} catch (e) {
			const originalMessage = e?.message || String(e);
			const error = _errorWithCustomMessage(this, "internal-error", `An internal AuthError has occurred: ${originalMessage}`);
			error.customData = { originalError: e };
			throw error;
		}
	}
	queue(action) {
		this.operations = this.operations.then(action, action);
		return this.operations;
	}
	get assertedPersistence() {
		_assert(this.persistenceManager, this, "internal-error");
		return this.persistenceManager;
	}
	_logFramework(framework) {
		if (!framework || this.frameworks.includes(framework)) return;
		this.frameworks.push(framework);
		this.frameworks.sort();
		this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
	}
	_getFrameworks() {
		return this.frameworks;
	}
	async _getAdditionalHeaders() {
		const headers = { ["X-Client-Version"]: this.clientVersion };
		if (this.app.options.appId) headers["X-Firebase-gmpid"] = this.app.options.appId;
		const heartbeatsHeader = await this.heartbeatServiceProvider.getImmediate({ optional: true })?.getHeartbeatsHeader();
		if (heartbeatsHeader) headers["X-Firebase-Client"] = heartbeatsHeader;
		const appCheckToken = await this._getAppCheckToken();
		if (appCheckToken) headers["X-Firebase-AppCheck"] = appCheckToken;
		return headers;
	}
	async _getAppCheckToken() {
		if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) return this.app.settings.appCheckToken;
		const appCheckTokenResult = await this.appCheckServiceProvider.getImmediate({ optional: true })?.getToken();
		if (appCheckTokenResult?.error) _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
		return appCheckTokenResult?.token;
	}
};
/**
* Method to be used to cast down to our private implementation of Auth.
* It will also handle unwrapping from the compat type if necessary
*
* @param auth Auth object passed in from developer
*/
function _castAuth(auth) {
	return getModularInstance(auth);
}
/** Helper class to wrap subscriber logic */
var Subscription = class {
	constructor(auth) {
		this.auth = auth;
		this.observer = null;
		this.addObserver = createSubscribe((observer) => this.observer = observer);
	}
	get next() {
		_assert(this.observer, this.auth, "internal-error");
		return this.observer.next.bind(this.observer);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var externalJSProvider = {
	async loadJS() {
		throw new Error("Unable to load external scripts");
	},
	recaptchaV2Script: "",
	recaptchaEnterpriseScript: "",
	gapiScript: ""
};
function _loadJS(url) {
	return externalJSProvider.loadJS(url);
}
function _recaptchaEnterpriseScriptUrl() {
	return externalJSProvider.recaptchaEnterpriseScript;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MockGreCAPTCHATopLevel = class {
	constructor() {
		this.enterprise = new MockGreCAPTCHA();
	}
	ready(callback) {
		callback();
	}
	execute(_siteKey, _options) {
		return Promise.resolve("token");
	}
	render(_container, _parameters) {
		return "";
	}
};
var MockGreCAPTCHA = class {
	ready(callback) {
		callback();
	}
	execute(_siteKey, _options) {
		return Promise.resolve("token");
	}
	render(_container, _parameters) {
		return "";
	}
};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
var FAKE_TOKEN = "NO_RECAPTCHA";
var RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME = "onFirebaseAuthREInstanceReady";
var RecaptchaEnterpriseVerifier = class RecaptchaEnterpriseVerifier {
	/**
	*
	* @param authExtern - The corresponding Firebase {@link Auth} instance.
	*
	*/
	constructor(authExtern) {
		/**
		* Identifies the type of application verifier (e.g. "recaptcha-enterprise").
		*/
		this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
		this.auth = _castAuth(authExtern);
	}
	/**
	* Executes the verification process.
	*
	* @returns A Promise for a token that can be used to assert the validity of a request.
	*/
	async verify(action = "verify", forceRefresh = false) {
		async function retrieveSiteKey(auth) {
			if (!forceRefresh) {
				if (auth.tenantId == null && auth._agentRecaptchaConfig != null) return auth._agentRecaptchaConfig.siteKey;
				if (auth.tenantId != null && auth._tenantRecaptchaConfigs[auth.tenantId] !== void 0) return auth._tenantRecaptchaConfigs[auth.tenantId].siteKey;
			}
			return new Promise(async (resolve, reject) => {
				getRecaptchaConfig(auth, {
					clientType: "CLIENT_TYPE_WEB",
					version: "RECAPTCHA_ENTERPRISE"
				}).then((response) => {
					if (response.recaptchaKey === void 0) reject(/* @__PURE__ */ new Error("recaptcha Enterprise site key undefined"));
					else {
						const config = new RecaptchaConfig(response);
						if (auth.tenantId == null) auth._agentRecaptchaConfig = config;
						else auth._tenantRecaptchaConfigs[auth.tenantId] = config;
						return resolve(config.siteKey);
					}
				}).catch((error) => {
					reject(error);
				});
			});
		}
		function retrieveRecaptchaToken(siteKey, resolve, reject) {
			const grecaptcha = window.grecaptcha;
			if (isEnterprise(grecaptcha)) grecaptcha.enterprise.ready(() => {
				grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
					resolve(token);
				}).catch(() => {
					resolve(FAKE_TOKEN);
				});
			});
			else reject(Error("No reCAPTCHA enterprise script loaded."));
		}
		if (this.auth.settings.appVerificationDisabledForTesting) return new MockGreCAPTCHATopLevel().execute("siteKey", { action: "verify" });
		return new Promise((resolve, reject) => {
			retrieveSiteKey(this.auth).then(async (siteKey) => {
				if (!forceRefresh && isEnterprise(window.grecaptcha) && RecaptchaEnterpriseVerifier.scriptInjectionDeferred) {
					await RecaptchaEnterpriseVerifier.scriptInjectionDeferred.promise;
					retrieveRecaptchaToken(siteKey, resolve, reject);
				} else {
					if (typeof window === "undefined") {
						reject(/* @__PURE__ */ new Error("RecaptchaVerifier is only supported in browser"));
						return;
					}
					let url = _recaptchaEnterpriseScriptUrl();
					if (url.length !== 0) url += siteKey + `&onload=${RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME}`;
					RecaptchaEnterpriseVerifier.scriptInjectionDeferred = new Deferred();
					/**
					* Script attached to global window object that will be called
					* when the ReCAPTCHA Enterprise instance is ready.
					* grecaptcha.ready() is not reliable when there are multiple
					* scripts on the page, and script.onload only indicates the
					* script has downloaded, not that it has initialized.
					*/
					window[RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME] = () => {
						RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.resolve();
					};
					_loadJS(url).then(() => RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.promise).then(() => {
						retrieveRecaptchaToken(siteKey, resolve, reject);
					}).catch((error) => {
						reject(error);
					});
				}
			}).catch((error) => {
				reject(error);
			});
		});
	}
};
/**
* Deferred that resolves when script tag has been injected onto the page
* and the script is ready (grecaptcha.ready() and script.onload are not
* reliable indicators, so this resolves when the global
* `window[RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME]()` callback provided to the recaptcha url param "onload"
* is triggered).
* As a static variable this is applied to all instances of the class.
* This will cause an error if users try to create multiple RecaptchaVerifiers
* with different Recaptcha Enterprise sitekeys, which should be an
* unuspported use case.
*/
RecaptchaEnterpriseVerifier.scriptInjectionDeferred = null;
async function injectRecaptchaFields(auth, request, action, isCaptchaResp = false, isFakeToken = false) {
	const verifier = new RecaptchaEnterpriseVerifier(auth);
	let captchaResponse;
	if (isFakeToken) captchaResponse = FAKE_TOKEN;
	else try {
		captchaResponse = await verifier.verify(action);
	} catch (error) {
		captchaResponse = await verifier.verify(action, true);
	}
	const newRequest = { ...request };
	if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
		if ("phoneEnrollmentInfo" in newRequest) {
			const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
			const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
			Object.assign(newRequest, { "phoneEnrollmentInfo": {
				phoneNumber,
				recaptchaToken,
				captchaResponse,
				"clientType": "CLIENT_TYPE_WEB",
				"recaptchaVersion": "RECAPTCHA_ENTERPRISE"
			} });
		} else if ("phoneSignInInfo" in newRequest) {
			const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
			Object.assign(newRequest, { "phoneSignInInfo": {
				recaptchaToken,
				captchaResponse,
				"clientType": "CLIENT_TYPE_WEB",
				"recaptchaVersion": "RECAPTCHA_ENTERPRISE"
			} });
		}
		return newRequest;
	}
	if (!isCaptchaResp) Object.assign(newRequest, { captchaResponse });
	else Object.assign(newRequest, { "captchaResp": captchaResponse });
	Object.assign(newRequest, { "clientType": "CLIENT_TYPE_WEB" });
	Object.assign(newRequest, { "recaptchaVersion": "RECAPTCHA_ENTERPRISE" });
	return newRequest;
}
async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
	if (authInstance._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")) return actionMethod(authInstance, await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode"));
	else return actionMethod(authInstance, request).catch(async (error) => {
		if (error.code === `auth/missing-recaptcha-token`) {
			console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
			return actionMethod(authInstance, await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode"));
		} else return Promise.reject(error);
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Initializes an {@link Auth} instance with fine-grained control over
* {@link Dependencies}.
*
* @remarks
*
* This function allows more control over the {@link Auth} instance than
* {@link getAuth}. `getAuth` uses platform-specific defaults to supply
* the {@link Dependencies}. In general, `getAuth` is the easiest way to
* initialize Auth and works for most use cases. Use `initializeAuth` if you
* need control over which persistence layer is used, or to minimize bundle
* size if you're not using either `signInWithPopup` or `signInWithRedirect`.
*
* For example, if your app only uses anonymous accounts and you only want
* accounts saved for the current session, initialize `Auth` with:
*
* ```js
* const auth = initializeAuth(app, {
*   persistence: browserSessionPersistence,
*   popupRedirectResolver: undefined,
* });
* ```
*
* @public
*/
function initializeAuth(app, deps) {
	const provider = _getProvider(app, "auth");
	if (provider.isInitialized()) {
		const auth = provider.getImmediate();
		const initialOptions = provider.getOptions();
		if (deepEqual(initialOptions, deps ?? {})) return auth;
		else _fail(auth, "already-initialized");
	}
	return provider.initialize({ options: deps });
}
function _initializeAuthInstance(auth, deps) {
	const persistence = deps?.persistence || [];
	const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
	if (deps?.errorMap) auth._updateErrorMap(deps.errorMap);
	auth._initializeWithPersistence(hierarchy, deps?.popupRedirectResolver);
}
/**
* Changes the {@link Auth} instance to communicate with the Firebase Auth Emulator, instead of production
* Firebase Auth services.
*
* @remarks
* This must be called synchronously immediately following the first call to
* {@link initializeAuth}.  Do not use with production credentials as emulator
* traffic is not encrypted.
*
*
* @example
* ```javascript
* connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
* ```
*
* @param auth - The {@link Auth} instance.
* @param url - The URL at which the emulator is running (eg, 'http://localhost:9099').
* @param options - Optional. `options.disableWarnings` defaults to `false`. Set it to
* `true` to disable the warning banner attached to the DOM.
*
* @public
*/
function connectAuthEmulator(auth, url, options) {
	const authInternal = _castAuth(auth);
	_assert(/^https?:\/\//.test(url), authInternal, "invalid-emulator-scheme");
	const disableWarnings = !!options?.disableWarnings;
	const protocol = extractProtocol(url);
	const { host, port } = extractHostAndPort(url);
	const portStr = port === null ? "" : `:${port}`;
	const emulator = { url: `${protocol}//${host}${portStr}/` };
	const emulatorConfig = Object.freeze({
		host,
		port,
		protocol: protocol.replace(":", ""),
		options: Object.freeze({ disableWarnings })
	});
	if (!authInternal._canInitEmulator) {
		_assert(authInternal.config.emulator && authInternal.emulatorConfig, authInternal, "emulator-config-failed");
		_assert(deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig), authInternal, "emulator-config-failed");
		return;
	}
	authInternal.config.emulator = emulator;
	authInternal.emulatorConfig = emulatorConfig;
	authInternal.settings.appVerificationDisabledForTesting = true;
	if (isCloudWorkstation(host)) pingServer(`${protocol}//${host}${portStr}`);
	else if (!disableWarnings) emitEmulatorWarning();
}
function extractProtocol(url) {
	const protocolEnd = url.indexOf(":");
	return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
}
function extractHostAndPort(url) {
	const protocol = extractProtocol(url);
	const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
	if (!authority) return {
		host: "",
		port: null
	};
	const hostAndPort = authority[2].split("@").pop() || "";
	const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
	if (bracketedIPv6) {
		const host = bracketedIPv6[1];
		return {
			host,
			port: parsePort(hostAndPort.substr(host.length + 1))
		};
	} else {
		const [host, port] = hostAndPort.split(":");
		return {
			host,
			port: parsePort(port)
		};
	}
}
function parsePort(portStr) {
	if (!portStr) return null;
	const port = Number(portStr);
	if (isNaN(port)) return null;
	return port;
}
function emitEmulatorWarning() {
	function attachBanner() {
		const el = document.createElement("p");
		const sty = el.style;
		el.innerText = "Running in emulator mode. Do not use with production credentials.";
		sty.position = "fixed";
		sty.width = "100%";
		sty.backgroundColor = "#ffffff";
		sty.border = ".1em solid #000000";
		sty.color = "#b50000";
		sty.bottom = "0px";
		sty.left = "0px";
		sty.margin = "0px";
		sty.zIndex = "10000";
		sty.textAlign = "center";
		el.classList.add("firebase-emulator-warning");
		document.body.appendChild(el);
	}
	if (typeof console !== "undefined" && typeof console.info === "function") console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
	if (typeof window !== "undefined" && typeof document !== "undefined") if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", attachBanner);
	else attachBanner();
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Interface that represents the credentials returned by an {@link AuthProvider}.
*
* @remarks
* Implementations specify the details about each auth provider's credential requirements.
*
* @public
*/
var AuthCredential = class {
	/** @internal */
	constructor(providerId, signInMethod) {
		this.providerId = providerId;
		this.signInMethod = signInMethod;
	}
	/**
	* Returns a JSON-serializable representation of this object.
	*
	* @returns a JSON-serializable representation of this object.
	*/
	toJSON() {
		return debugFail("not implemented");
	}
	/** @internal */
	_getIdTokenResponse(_auth) {
		return debugFail("not implemented");
	}
	/** @internal */
	_linkToIdToken(_auth, _idToken) {
		return debugFail("not implemented");
	}
	/** @internal */
	_getReauthenticationResolver(_auth) {
		return debugFail("not implemented");
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function linkEmailPassword(auth, request) {
	return _performApiRequest(auth, "POST", "/v1/accounts:signUp", request);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function signInWithPassword(auth, request) {
	return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function signInWithEmailLink$1(auth, request) {
	return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
async function signInWithEmailLinkForLinking(auth, request) {
	return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Interface that represents the credentials returned by {@link EmailAuthProvider} for
* {@link ProviderId}.PASSWORD
*
* @remarks
* Covers both {@link SignInMethod}.EMAIL_PASSWORD and
* {@link SignInMethod}.EMAIL_LINK.
*
* @public
*/
var EmailAuthCredential = class EmailAuthCredential extends AuthCredential {
	/** @internal */
	constructor(_email, _password, signInMethod, _tenantId = null) {
		super("password", signInMethod);
		this._email = _email;
		this._password = _password;
		this._tenantId = _tenantId;
	}
	/** @internal */
	static _fromEmailAndPassword(email, password) {
		return new EmailAuthCredential(email, password, "password");
	}
	/** @internal */
	static _fromEmailAndCode(email, oobCode, tenantId = null) {
		return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
	}
	/** {@inheritdoc AuthCredential.toJSON} */
	toJSON() {
		return {
			email: this._email,
			password: this._password,
			signInMethod: this.signInMethod,
			tenantId: this._tenantId
		};
	}
	/**
	* Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
	*
	* @param json - Either `object` or the stringified representation of the object. When string is
	* provided, `JSON.parse` would be called first.
	*
	* @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
	*/
	static fromJSON(json) {
		const obj = typeof json === "string" ? JSON.parse(json) : json;
		if (obj?.email && obj?.password) {
			if (obj.signInMethod === "password") return this._fromEmailAndPassword(obj.email, obj.password);
			else if (obj.signInMethod === "emailLink") return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
		}
		return null;
	}
	/** @internal */
	async _getIdTokenResponse(auth) {
		switch (this.signInMethod) {
			case "password": return handleRecaptchaFlow(auth, {
				returnSecureToken: true,
				email: this._email,
				password: this._password,
				clientType: "CLIENT_TYPE_WEB"
			}, "signInWithPassword", signInWithPassword);
			case "emailLink": return signInWithEmailLink$1(auth, {
				email: this._email,
				oobCode: this._password
			});
			default: _fail(auth, "internal-error");
		}
	}
	/** @internal */
	async _linkToIdToken(auth, idToken) {
		switch (this.signInMethod) {
			case "password": return handleRecaptchaFlow(auth, {
				idToken,
				returnSecureToken: true,
				email: this._email,
				password: this._password,
				clientType: "CLIENT_TYPE_WEB"
			}, "signUpPassword", linkEmailPassword);
			case "emailLink": return signInWithEmailLinkForLinking(auth, {
				idToken,
				email: this._email,
				oobCode: this._password
			});
			default: _fail(auth, "internal-error");
		}
	}
	/** @internal */
	_getReauthenticationResolver(auth) {
		return this._getIdTokenResponse(auth);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function signInWithIdp(auth, request) {
	return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var IDP_REQUEST_URI$1 = "http://localhost";
/**
* Represents the OAuth credentials returned by an {@link OAuthProvider}.
*
* @remarks
* Implementations specify the details about each auth provider's credential requirements.
*
* @public
*/
var OAuthCredential = class OAuthCredential extends AuthCredential {
	constructor() {
		super(...arguments);
		this.pendingToken = null;
	}
	/** @internal */
	static _fromParams(params) {
		const cred = new OAuthCredential(params.providerId, params.signInMethod);
		if (params.idToken || params.accessToken) {
			if (params.idToken) cred.idToken = params.idToken;
			if (params.accessToken) cred.accessToken = params.accessToken;
			if (params.nonce && !params.pendingToken) cred.nonce = params.nonce;
			if (params.pendingToken) cred.pendingToken = params.pendingToken;
		} else if (params.oauthToken && params.oauthTokenSecret) {
			cred.accessToken = params.oauthToken;
			cred.secret = params.oauthTokenSecret;
		} else _fail("argument-error");
		return cred;
	}
	/** {@inheritdoc AuthCredential.toJSON}  */
	toJSON() {
		return {
			idToken: this.idToken,
			accessToken: this.accessToken,
			secret: this.secret,
			nonce: this.nonce,
			pendingToken: this.pendingToken,
			providerId: this.providerId,
			signInMethod: this.signInMethod
		};
	}
	/**
	* Static method to deserialize a JSON representation of an object into an
	* {@link  AuthCredential}.
	*
	* @param json - Input can be either Object or the stringified representation of the object.
	* When string is provided, JSON.parse would be called first.
	*
	* @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
	*/
	static fromJSON(json) {
		const { providerId, signInMethod, ...rest } = typeof json === "string" ? JSON.parse(json) : json;
		if (!providerId || !signInMethod) return null;
		const cred = new OAuthCredential(providerId, signInMethod);
		cred.idToken = rest.idToken || void 0;
		cred.accessToken = rest.accessToken || void 0;
		cred.secret = rest.secret;
		cred.nonce = rest.nonce;
		cred.pendingToken = rest.pendingToken || null;
		return cred;
	}
	/** @internal */
	_getIdTokenResponse(auth) {
		return signInWithIdp(auth, this.buildRequest());
	}
	/** @internal */
	_linkToIdToken(auth, idToken) {
		const request = this.buildRequest();
		request.idToken = idToken;
		return signInWithIdp(auth, request);
	}
	/** @internal */
	_getReauthenticationResolver(auth) {
		const request = this.buildRequest();
		request.autoCreate = false;
		return signInWithIdp(auth, request);
	}
	buildRequest() {
		const request = {
			requestUri: IDP_REQUEST_URI$1,
			returnSecureToken: true
		};
		if (this.pendingToken) request.pendingToken = this.pendingToken;
		else {
			const postBody = {};
			if (this.idToken) postBody["id_token"] = this.idToken;
			if (this.accessToken) postBody["access_token"] = this.accessToken;
			if (this.secret) postBody["oauth_token_secret"] = this.secret;
			postBody["providerId"] = this.providerId;
			if (this.nonce && !this.pendingToken) postBody["nonce"] = this.nonce;
			request.postBody = querystring(postBody);
		}
		return request;
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Maps the mode string in action code URL to Action Code Info operation.
*
* @param mode
*/
function parseMode(mode) {
	switch (mode) {
		case "recoverEmail": return "RECOVER_EMAIL";
		case "resetPassword": return "PASSWORD_RESET";
		case "signIn": return "EMAIL_SIGNIN";
		case "verifyEmail": return "VERIFY_EMAIL";
		case "verifyAndChangeEmail": return "VERIFY_AND_CHANGE_EMAIL";
		case "revertSecondFactorAddition": return "REVERT_SECOND_FACTOR_ADDITION";
		default: return null;
	}
}
/**
* Helper to parse FDL links
*
* @param url
*/
function parseDeepLink(url) {
	const link = querystringDecode(extractQuerystring(url))["link"];
	const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
	const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
	return (iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null) || iOSDeepLink || doubleDeepLink || link || url;
}
/**
* A utility class to parse email action URLs such as password reset, email verification,
* email link sign in, etc.
*
* @public
*/
var ActionCodeURL = class ActionCodeURL {
	/**
	* @param actionLink - The link from which to extract the URL.
	* @returns The {@link ActionCodeURL} object, or null if the link is invalid.
	*
	* @internal
	*/
	constructor(actionLink) {
		const searchParams = querystringDecode(extractQuerystring(actionLink));
		const apiKey = searchParams["apiKey"] ?? null;
		const code = searchParams["oobCode"] ?? null;
		const operation = parseMode(searchParams["mode"] ?? null);
		_assert(apiKey && code && operation, "argument-error");
		this.apiKey = apiKey;
		this.operation = operation;
		this.code = code;
		this.continueUrl = searchParams["continueUrl"] ?? null;
		this.languageCode = searchParams["lang"] ?? null;
		this.tenantId = searchParams["tenantId"] ?? null;
	}
	/**
	* Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
	* otherwise returns null.
	*
	* @param link  - The email action link string.
	* @returns The {@link ActionCodeURL} object, or null if the link is invalid.
	*
	* @public
	*/
	static parseLink(link) {
		const actionLink = parseDeepLink(link);
		try {
			return new ActionCodeURL(actionLink);
		} catch {
			return null;
		}
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for generating {@link EmailAuthCredential}.
*
* @public
*/
var EmailAuthProvider = class EmailAuthProvider {
	constructor() {
		/**
		* Always set to {@link ProviderId}.PASSWORD, even for email link.
		*/
		this.providerId = EmailAuthProvider.PROVIDER_ID;
	}
	/**
	* Initialize an {@link AuthCredential} using an email and password.
	*
	* @example
	* ```javascript
	* const authCredential = EmailAuthProvider.credential(email, password);
	* const userCredential = await signInWithCredential(auth, authCredential);
	* ```
	*
	* @example
	* ```javascript
	* const userCredential = await signInWithEmailAndPassword(auth, email, password);
	* ```
	*
	* @param email - Email address.
	* @param password - User account password.
	* @returns The auth provider credential.
	*/
	static credential(email, password) {
		return EmailAuthCredential._fromEmailAndPassword(email, password);
	}
	/**
	* Initialize an {@link AuthCredential} using an email and an email link after a sign in with
	* email link operation.
	*
	* @example
	* ```javascript
	* const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
	* const userCredential = await signInWithCredential(auth, authCredential);
	* ```
	*
	* @example
	* ```javascript
	* await sendSignInLinkToEmail(auth, email);
	* // Obtain emailLink from user.
	* const userCredential = await signInWithEmailLink(auth, email, emailLink);
	* ```
	*
	* @param auth - The {@link Auth} instance used to verify the link.
	* @param email - Email address.
	* @param emailLink - Sign-in email link.
	* @returns - The auth provider credential.
	*/
	static credentialWithLink(email, emailLink) {
		const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
		_assert(actionCodeUrl, "argument-error");
		return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
	}
};
/**
* Always set to {@link ProviderId}.PASSWORD, even for email link.
*/
EmailAuthProvider.PROVIDER_ID = "password";
/**
* Always set to {@link SignInMethod}.EMAIL_PASSWORD.
*/
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
/**
* Always set to {@link SignInMethod}.EMAIL_LINK.
*/
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The base class for all Federated providers (OAuth (including OIDC), SAML).
*
* This class is not meant to be instantiated directly.
*
* @public
*/
var FederatedAuthProvider = class {
	/**
	* Constructor for generic OAuth providers.
	*
	* @param providerId - Provider for which credentials should be generated.
	*/
	constructor(providerId) {
		this.providerId = providerId;
		/** @internal */
		this.defaultLanguageCode = null;
		/** @internal */
		this.customParameters = {};
	}
	/**
	* Set the language gode.
	*
	* @param languageCode - language code
	*/
	setDefaultLanguage(languageCode) {
		this.defaultLanguageCode = languageCode;
	}
	/**
	* Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
	* operations.
	*
	* @remarks
	* For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
	* `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
	*
	* @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
	*/
	setCustomParameters(customOAuthParameters) {
		this.customParameters = customOAuthParameters;
		return this;
	}
	/**
	* Retrieve the current list of {@link CustomParameters}.
	*/
	getCustomParameters() {
		return this.customParameters;
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Common code to all OAuth providers. This is separate from the
* {@link OAuthProvider} so that child providers (like
* {@link GoogleAuthProvider}) don't inherit the `credential` instance method.
* Instead, they rely on a static `credential` method.
*/
var BaseOAuthProvider = class extends FederatedAuthProvider {
	constructor() {
		super(...arguments);
		/** @internal */
		this.scopes = [];
	}
	/**
	* Add an OAuth scope to the credential.
	*
	* @param scope - Provider OAuth scope to add.
	*/
	addScope(scope) {
		if (!this.scopes.includes(scope)) this.scopes.push(scope);
		return this;
	}
	/**
	* Retrieve the current list of OAuth scopes.
	*/
	getScopes() {
		return [...this.scopes];
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for generating an {@link OAuthCredential} for {@link ProviderId}.FACEBOOK.
*
* @example
* ```javascript
* // Sign in using a redirect.
* const provider = new FacebookAuthProvider();
* // Start a sign in process for an unauthenticated user.
* provider.addScope('user_birthday');
* await signInWithRedirect(auth, provider);
* // This will trigger a full page redirect away from your app
*
* // After returning from the redirect when your app initializes you can obtain the result
* const result = await getRedirectResult(auth);
* if (result) {
*   // This is the signed-in user
*   const user = result.user;
*   // This gives you a Facebook Access Token.
*   const credential = FacebookAuthProvider.credentialFromResult(result);
*   const token = credential.accessToken;
* }
* ```
*
* @example
* ```javascript
* // Sign in using a popup.
* const provider = new FacebookAuthProvider();
* provider.addScope('user_birthday');
* const result = await signInWithPopup(auth, provider);
*
* // The signed-in user info.
* const user = result.user;
* // This gives you a Facebook Access Token.
* const credential = FacebookAuthProvider.credentialFromResult(result);
* const token = credential.accessToken;
* ```
*
* @public
*/
var FacebookAuthProvider = class FacebookAuthProvider extends BaseOAuthProvider {
	constructor() {
		super("facebook.com");
	}
	/**
	* Creates a credential for Facebook.
	*
	* @example
	* ```javascript
	* // `event` from the Facebook auth.authResponseChange callback.
	* const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
	* const result = await signInWithCredential(credential);
	* ```
	*
	* @param accessToken - Facebook access token.
	*/
	static credential(accessToken) {
		return OAuthCredential._fromParams({
			providerId: FacebookAuthProvider.PROVIDER_ID,
			signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
			accessToken
		});
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromResult(userCredential) {
		return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
	* thrown during a sign-in, link, or reauthenticate operation.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromError(error) {
		return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
		if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) return null;
		if (!tokenResponse.oauthAccessToken) return null;
		try {
			return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
		} catch {
			return null;
		}
	}
};
/** Always set to {@link SignInMethod}.FACEBOOK. */
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
/** Always set to {@link ProviderId}.FACEBOOK. */
FacebookAuthProvider.PROVIDER_ID = "facebook.com";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for generating an {@link OAuthCredential} for {@link ProviderId}.GOOGLE.
*
* @example
* ```javascript
* // Sign in using a redirect.
* const provider = new GoogleAuthProvider();
* // Start a sign in process for an unauthenticated user.
* provider.addScope('profile');
* provider.addScope('email');
* await signInWithRedirect(auth, provider);
* // This will trigger a full page redirect away from your app
*
* // After returning from the redirect when your app initializes you can obtain the result
* const result = await getRedirectResult(auth);
* if (result) {
*   // This is the signed-in user
*   const user = result.user;
*   // This gives you a Google Access Token.
*   const credential = GoogleAuthProvider.credentialFromResult(result);
*   const token = credential.accessToken;
* }
* ```
*
* @example
* ```javascript
* // Sign in using a popup.
* const provider = new GoogleAuthProvider();
* provider.addScope('profile');
* provider.addScope('email');
* const result = await signInWithPopup(auth, provider);
*
* // The signed-in user info.
* const user = result.user;
* // This gives you a Google Access Token.
* const credential = GoogleAuthProvider.credentialFromResult(result);
* const token = credential.accessToken;
* ```
*
* @public
*/
var GoogleAuthProvider = class GoogleAuthProvider extends BaseOAuthProvider {
	constructor() {
		super("google.com");
		this.addScope("profile");
	}
	/**
	* Creates a credential for Google. At least one of ID token and access token is required.
	*
	* @example
	* ```javascript
	* // \`googleUser\` from the onsuccess Google Sign In callback.
	* const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
	* const result = await signInWithCredential(credential);
	* ```
	*
	* @param idToken - Google ID token.
	* @param accessToken - Google access token.
	*/
	static credential(idToken, accessToken) {
		return OAuthCredential._fromParams({
			providerId: GoogleAuthProvider.PROVIDER_ID,
			signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
			idToken,
			accessToken
		});
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromResult(userCredential) {
		return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
	* thrown during a sign-in, link, or reauthenticate operation.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromError(error) {
		return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
		if (!tokenResponse) return null;
		const { oauthIdToken, oauthAccessToken } = tokenResponse;
		if (!oauthIdToken && !oauthAccessToken) return null;
		try {
			return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
		} catch {
			return null;
		}
	}
};
/** Always set to {@link SignInMethod}.GOOGLE. */
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
/** Always set to {@link ProviderId}.GOOGLE. */
GoogleAuthProvider.PROVIDER_ID = "google.com";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for generating an {@link OAuthCredential} for {@link ProviderId}.GITHUB.
*
* @remarks
* GitHub requires an OAuth 2.0 redirect, so you can either handle the redirect directly, or use
* the {@link signInWithPopup} handler:
*
* @example
* ```javascript
* // Sign in using a redirect.
* const provider = new GithubAuthProvider();
* // Start a sign in process for an unauthenticated user.
* provider.addScope('repo');
* await signInWithRedirect(auth, provider);
* // This will trigger a full page redirect away from your app
*
* // After returning from the redirect when your app initializes you can obtain the result
* const result = await getRedirectResult(auth);
* if (result) {
*   // This is the signed-in user
*   const user = result.user;
*   // This gives you a GitHub Access Token.
*   const credential = GithubAuthProvider.credentialFromResult(result);
*   const token = credential.accessToken;
* }
* ```
*
* @example
* ```javascript
* // Sign in using a popup.
* const provider = new GithubAuthProvider();
* provider.addScope('repo');
* const result = await signInWithPopup(auth, provider);
*
* // The signed-in user info.
* const user = result.user;
* // This gives you a GitHub Access Token.
* const credential = GithubAuthProvider.credentialFromResult(result);
* const token = credential.accessToken;
* ```
* @public
*/
var GithubAuthProvider = class GithubAuthProvider extends BaseOAuthProvider {
	constructor() {
		super("github.com");
	}
	/**
	* Creates a credential for GitHub.
	*
	* @param accessToken - GitHub access token.
	*/
	static credential(accessToken) {
		return OAuthCredential._fromParams({
			providerId: GithubAuthProvider.PROVIDER_ID,
			signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
			accessToken
		});
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromResult(userCredential) {
		return GithubAuthProvider.credentialFromTaggedObject(userCredential);
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
	* thrown during a sign-in, link, or reauthenticate operation.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromError(error) {
		return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
		if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) return null;
		if (!tokenResponse.oauthAccessToken) return null;
		try {
			return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
		} catch {
			return null;
		}
	}
};
/** Always set to {@link SignInMethod}.GITHUB. */
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
/** Always set to {@link ProviderId}.GITHUB. */
GithubAuthProvider.PROVIDER_ID = "github.com";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for generating an {@link OAuthCredential} for {@link ProviderId}.TWITTER.
*
* @example
* ```javascript
* // Sign in using a redirect.
* const provider = new TwitterAuthProvider();
* // Start a sign in process for an unauthenticated user.
* await signInWithRedirect(auth, provider);
* // This will trigger a full page redirect away from your app
*
* // After returning from the redirect when your app initializes you can obtain the result
* const result = await getRedirectResult(auth);
* if (result) {
*   // This is the signed-in user
*   const user = result.user;
*   // This gives you a Twitter Access Token and Secret.
*   const credential = TwitterAuthProvider.credentialFromResult(result);
*   const token = credential.accessToken;
*   const secret = credential.secret;
* }
* ```
*
* @example
* ```javascript
* // Sign in using a popup.
* const provider = new TwitterAuthProvider();
* const result = await signInWithPopup(auth, provider);
*
* // The signed-in user info.
* const user = result.user;
* // This gives you a Twitter Access Token and Secret.
* const credential = TwitterAuthProvider.credentialFromResult(result);
* const token = credential.accessToken;
* const secret = credential.secret;
* ```
*
* @public
*/
var TwitterAuthProvider = class TwitterAuthProvider extends BaseOAuthProvider {
	constructor() {
		super("twitter.com");
	}
	/**
	* Creates a credential for Twitter.
	*
	* @param token - Twitter access token.
	* @param secret - Twitter secret.
	*/
	static credential(token, secret) {
		return OAuthCredential._fromParams({
			providerId: TwitterAuthProvider.PROVIDER_ID,
			signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
			oauthToken: token,
			oauthTokenSecret: secret
		});
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromResult(userCredential) {
		return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
	}
	/**
	* Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
	* thrown during a sign-in, link, or reauthenticate operation.
	*
	* @param userCredential - The user credential.
	*/
	static credentialFromError(error) {
		return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
		if (!tokenResponse) return null;
		const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
		if (!oauthAccessToken || !oauthTokenSecret) return null;
		try {
			return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
		} catch {
			return null;
		}
	}
};
/** Always set to {@link SignInMethod}.TWITTER. */
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
/** Always set to {@link ProviderId}.TWITTER. */
TwitterAuthProvider.PROVIDER_ID = "twitter.com";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var UserCredentialImpl = class UserCredentialImpl {
	constructor(params) {
		this.user = params.user;
		this.providerId = params.providerId;
		this._tokenResponse = params._tokenResponse;
		this.operationType = params.operationType;
	}
	static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
		const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
		const providerId = providerIdForResponse(idTokenResponse);
		return new UserCredentialImpl({
			user,
			providerId,
			_tokenResponse: idTokenResponse,
			operationType
		});
	}
	static async _forOperation(user, operationType, response) {
		await user._updateTokensIfNecessary(response, true);
		const providerId = providerIdForResponse(response);
		return new UserCredentialImpl({
			user,
			providerId,
			_tokenResponse: response,
			operationType
		});
	}
};
function providerIdForResponse(response) {
	if (response.providerId) return response.providerId;
	if ("phoneNumber" in response) return "phone";
	return null;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MultiFactorError = class MultiFactorError extends FirebaseError {
	constructor(auth, error, operationType, user) {
		super(error.code, error.message);
		this.operationType = operationType;
		this.user = user;
		Object.setPrototypeOf(this, MultiFactorError.prototype);
		this.customData = {
			appName: auth.name,
			tenantId: auth.tenantId ?? void 0,
			_serverResponse: error.customData._serverResponse,
			operationType
		};
	}
	static _fromErrorAndOperation(auth, error, operationType, user) {
		return new MultiFactorError(auth, error, operationType, user);
	}
};
function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
	return (operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth)).catch((error) => {
		if (error.code === `auth/multi-factor-auth-required`) throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
		throw error;
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function _signInWithCredential(auth, credential, bypassAuthState = false) {
	if (_isFirebaseServerApp(auth.app)) return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
	const operationType = "signIn";
	const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
	const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
	if (!bypassAuthState) await auth._updateCurrentUser(userCredential.user);
	return userCredential;
}
/**
* Asynchronously signs in with the given credentials.
*
* @remarks
* An {@link AuthProvider} can be used to generate the credential.
*
* This method is not supported by {@link Auth} instances created with a
* {@link @firebase/app#FirebaseServerApp}.
*
* @param auth - The {@link Auth} instance.
* @param credential - The auth credential.
*
* @public
*/
async function signInWithCredential(auth, credential) {
	return _signInWithCredential(_castAuth(auth), credential);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Adds an observer for changes to the user's sign-in state.
*
* @remarks
* To keep the old behavior, see {@link onIdTokenChanged}.
*
* @param auth - The {@link Auth} instance.
* @param nextOrObserver - callback triggered on change.
* @param error - Deprecated. This callback is never triggered. Errors
* on signing in/out can be caught in promises returned from
* sign-in/sign-out functions.
* @param completed - Deprecated. This callback is never triggered.
*
* @public
*/
function onAuthStateChanged(auth, nextOrObserver, error, completed) {
	return getModularInstance(auth).onAuthStateChanged(nextOrObserver, error, completed);
}
/**
* Signs out the current user.
*
* @remarks
* This method is not supported by {@link Auth} instances created with a
* {@link @firebase/app#FirebaseServerApp}.
*
* @param auth - The {@link Auth} instance.
*
* @public
*/
function signOut(auth) {
	return getModularInstance(auth).signOut();
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function startEnrollTotpMfa(auth, request) {
	return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
}
function finalizeEnrollTotpMfa(auth, request) {
	return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
}
var name = "@firebase/auth";
var version = "1.13.6";
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var AuthInterop = class {
	constructor(auth) {
		this.auth = auth;
		this.internalListeners = /* @__PURE__ */ new Map();
	}
	getUid() {
		this.assertAuthConfigured();
		return this.auth.currentUser?.uid || null;
	}
	async getToken(forceRefresh) {
		this.assertAuthConfigured();
		await this.auth._initializationPromise;
		if (!this.auth.currentUser) return null;
		return { accessToken: await this.auth.currentUser.getIdToken(forceRefresh) };
	}
	addAuthTokenListener(listener) {
		this.assertAuthConfigured();
		if (this.internalListeners.has(listener)) return;
		const unsubscribe = this.auth.onIdTokenChanged((user) => {
			listener(user?.stsTokenManager.accessToken || null);
		});
		this.internalListeners.set(listener, unsubscribe);
		this.updateProactiveRefresh();
	}
	removeAuthTokenListener(listener) {
		this.assertAuthConfigured();
		const unsubscribe = this.internalListeners.get(listener);
		if (!unsubscribe) return;
		this.internalListeners.delete(listener);
		unsubscribe();
		this.updateProactiveRefresh();
	}
	assertAuthConfigured() {
		_assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
	}
	updateProactiveRefresh() {
		if (this.internalListeners.size > 0) this.auth._startProactiveRefresh();
		else this.auth._stopProactiveRefresh();
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function getVersionForPlatform(clientPlatform) {
	switch (clientPlatform) {
		case "Node": return "node";
		case "ReactNative": return "rn";
		case "Worker": return "webworker";
		case "Cordova": return "cordova";
		case "WebExtension": return "web-extension";
		default: return;
	}
}
/** @internal */
function registerAuth(clientPlatform) {
	_registerComponent(new Component("auth", (container, { options: deps }) => {
		const app = container.getProvider("app").getImmediate();
		const heartbeatServiceProvider = container.getProvider("heartbeat");
		const appCheckServiceProvider = container.getProvider("app-check-internal");
		const { apiKey, authDomain } = app.options;
		_assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app.name });
		const authInstance = new AuthImpl(app, heartbeatServiceProvider, appCheckServiceProvider, {
			apiKey,
			authDomain,
			clientPlatform,
			apiHost: "identitytoolkit.googleapis.com",
			tokenApiHost: "securetoken.googleapis.com",
			apiScheme: "https",
			sdkClientVersion: _getClientVersion(clientPlatform)
		});
		_initializeAuthInstance(authInstance, deps);
		return authInstance;
	}, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
		container.getProvider("auth-internal").initialize();
	}));
	_registerComponent(new Component("auth-internal", (container) => {
		return ((auth) => new AuthInterop(auth))(_castAuth(container.getProvider("auth").getImmediate()));
	}, "PRIVATE").setInstantiationMode("EXPLICIT"));
	registerVersion(name, version, getVersionForPlatform(clientPlatform));
	registerVersion(name, version, "esm2020");
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
FetchProvider.initialize(fetch, Headers, Response);
function getAuth(app = getApp()) {
	const provider = _getProvider(app, "auth");
	if (provider.isInitialized()) return provider.getImmediate();
	const auth = initializeAuth(app);
	const authEmulatorHost = getDefaultEmulatorHost("auth");
	if (authEmulatorHost) connectAuthEmulator(auth, `http://${authEmulatorHost}`);
	return auth;
}
registerAuth("Node");
/** auth/operation-not-supported-in-this-environment */
var NOT_AVAILABLE_ERROR = _createError("operation-not-supported-in-this-environment");
/** Reject with auth/operation-not-supported-in-this-environment */
async function fail() {
	throw NOT_AVAILABLE_ERROR;
}
var signInWithPopup = fail;
AuthImpl.prototype.setPersistence = async () => {};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function finalizeSignInTotpMfa(auth, request) {
	return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
}
var MultiFactorAssertionImpl = class {
	constructor(factorId) {
		this.factorId = factorId;
	}
	_process(auth, session, displayName) {
		switch (session.type) {
			case "enroll": return this._finalizeEnroll(auth, session.credential, displayName);
			case "signin": return this._finalizeSignIn(auth, session.credential);
			default: return debugFail("unexpected MultiFactorSessionType");
		}
	}
};
/**
* Provider for generating a {@link TotpMultiFactorAssertion}.
*
* @public
*/
var TotpMultiFactorGenerator = class {
	/**
	* Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
	* the TOTP (time-based one-time password) second factor.
	* This assertion is used to complete enrollment in TOTP second factor.
	*
	* @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
	* @param oneTimePassword One-time password from TOTP App.
	* @returns A {@link TotpMultiFactorAssertion} which can be used with
	* {@link MultiFactorUser.enroll}.
	*/
	static assertionForEnrollment(secret, oneTimePassword) {
		return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
	}
	/**
	* Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
	* This assertion is used to complete signIn with TOTP as the second factor.
	*
	* @param enrollmentId identifies the enrolled TOTP second factor.
	* @param oneTimePassword One-time password from TOTP App.
	* @returns A {@link TotpMultiFactorAssertion} which can be used with
	* {@link MultiFactorResolver.resolveSignIn}.
	*/
	static assertionForSignIn(enrollmentId, oneTimePassword) {
		return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
	}
	/**
	* Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
	* Creates a TOTP secret as part of enrolling a TOTP second factor.
	* Used for generating a QR code URL or inputting into a TOTP app.
	* This method uses the auth instance corresponding to the user in the multiFactorSession.
	*
	* @param session The {@link MultiFactorSession} that the user is part of.
	* @returns A promise to {@link TotpSecret}.
	*/
	static async generateSecret(session) {
		const mfaSession = session;
		_assert(typeof mfaSession.user?.auth !== "undefined", "internal-error");
		const response = await startEnrollTotpMfa(mfaSession.user.auth, {
			idToken: mfaSession.credential,
			totpEnrollmentInfo: {}
		});
		return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
	}
};
/**
* The identifier of the TOTP second factor: `totp`.
*/
TotpMultiFactorGenerator.FACTOR_ID = "totp";
var TotpMultiFactorAssertionImpl = class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
	constructor(otp, enrollmentId, secret) {
		super("totp");
		this.otp = otp;
		this.enrollmentId = enrollmentId;
		this.secret = secret;
	}
	/** @internal */
	static _fromSecret(secret, otp) {
		return new TotpMultiFactorAssertionImpl(otp, void 0, secret);
	}
	/** @internal */
	static _fromEnrollmentId(enrollmentId, otp) {
		return new TotpMultiFactorAssertionImpl(otp, enrollmentId);
	}
	/** @internal */
	async _finalizeEnroll(auth, idToken, displayName) {
		_assert(typeof this.secret !== "undefined", auth, "argument-error");
		return finalizeEnrollTotpMfa(auth, {
			idToken,
			displayName,
			totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
		});
	}
	/** @internal */
	async _finalizeSignIn(auth, mfaPendingCredential) {
		_assert(this.enrollmentId !== void 0 && this.otp !== void 0, auth, "argument-error");
		const totpVerificationInfo = { verificationCode: this.otp };
		return finalizeSignInTotpMfa(auth, {
			mfaPendingCredential,
			mfaEnrollmentId: this.enrollmentId,
			totpVerificationInfo
		});
	}
};
/**
* Provider for generating a {@link TotpMultiFactorAssertion}.
*
* Stores the shared secret key and other parameters to generate time-based OTPs.
* Implements methods to retrieve the shared secret key and generate a QR code URL.
* @public
*/
var TotpSecret = class TotpSecret {
	constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
		this.sessionInfo = sessionInfo;
		this.auth = auth;
		this.secretKey = secretKey;
		this.hashingAlgorithm = hashingAlgorithm;
		this.codeLength = codeLength;
		this.codeIntervalSeconds = codeIntervalSeconds;
		this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
	}
	/** @internal */
	static _fromStartTotpMfaEnrollmentResponse(response, auth) {
		return new TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
	}
	/** @internal */
	_makeTotpVerificationInfo(otp) {
		return {
			sessionInfo: this.sessionInfo,
			verificationCode: otp
		};
	}
	/**
	* Returns a QR code URL as described in
	* https://github.com/google/google-authenticator/wiki/Key-Uri-Format
	* This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
	* If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
	*
	* @param accountName the name of the account/app along with a user identifier.
	* @param issuer issuer of the TOTP (likely the app name).
	* @returns A QR code URL string.
	*/
	generateQrCodeUrl(accountName, issuer) {
		let useDefaults = false;
		if (_isEmptyString(accountName) || _isEmptyString(issuer)) useDefaults = true;
		if (useDefaults) {
			if (_isEmptyString(accountName)) accountName = this.auth.currentUser?.email || "unknownuser";
			if (_isEmptyString(issuer)) issuer = this.auth.name;
		}
		return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
	}
};
/** @internal */
function _isEmptyString(input) {
	return typeof input === "undefined" || input?.length === 0;
}
//#endregion
export { signInWithPopup as a, signInWithCredential as i, getAuth as n, signOut as o, onAuthStateChanged as r, GoogleAuthProvider as t };
