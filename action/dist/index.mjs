import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);
import {
  secp256k1,
  sha256
} from "./chunk-AYBSHAX2.mjs";
import {
  AbiDecodingDataSizeTooSmallError,
  AbiDecodingZeroDataError,
  AbiEncodingLengthMismatchError,
  AbiEventNotFoundError,
  AbiEventSignatureEmptyTopicsError,
  AbiEventSignatureNotFoundError,
  AtomicReadyWalletRejectedUpgradeError,
  AtomicityNotSupportedError,
  BaseError,
  BaseError2,
  BundleTooLargeError,
  BytesSizeMismatchError,
  CallExecutionError,
  ChainDisconnectedError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
  DuplicateIdError,
  ExecutionRevertedError,
  FeePayerNonceMismatchError,
  HttpRequestError,
  IntegerOutOfRangeError,
  InternalRpcError,
  InvalidAddressError,
  InvalidInputRpcError,
  InvalidParamsRpcError,
  InvalidRequestRpcError,
  InvalidSerializableTransactionError,
  JsonRpcVersionUnsupportedError,
  LimitExceededRpcError,
  LruMap,
  MethodNotFoundRpcError,
  MethodNotSupportedRpcError,
  ParseRpcError,
  PositionOutOfBoundsError,
  ProviderDisconnectedError,
  RawContractError,
  ResourceNotFoundRpcError,
  ResourceUnavailableRpcError,
  ResponseBodyTooLargeError,
  RpcRequestError,
  SocketClosedError,
  SwitchChainError,
  TimeoutError,
  TransactionExecutionError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  TransactionReceiptRevertedError,
  TransactionRejectedRpcError,
  UnauthorizedProviderError,
  UnknownBundleIdError,
  UnknownNodeError,
  UnknownRpcError,
  UnsupportedChainIdError,
  UnsupportedNonOptionalCapabilityError,
  UnsupportedPackedAbiType,
  UnsupportedProviderMethodError,
  UserRejectedRequestError,
  WaitForTransactionReceiptTimeoutError,
  WalletConnectSessionSettlementError,
  WebSocketRequestError,
  addressResolverAbi,
  arrayRegex,
  assertRequest,
  boolToHex,
  bytesRegex,
  bytesToHex,
  bytesToString,
  call,
  checksumAddress,
  concat,
  concat2,
  concatHex,
  createBatchScheduler,
  createCursor,
  decodeAbiParameters,
  decodeFunctionResult,
  deploylessCallViaBytecodeBytecode,
  encodeAbiParameters,
  encodeDeployData,
  encodeFunctionData,
  erc1271Abi,
  erc20Abi,
  erc6492SignatureValidatorAbi,
  erc6492SignatureValidatorByteCode,
  extract,
  format,
  formatAbiItem,
  formatAbiItem2,
  formatAbiParameters,
  formatBlockParameter,
  formatEther,
  formatGwei,
  formatTransactionRequest,
  from,
  from2,
  fromBoolean,
  fromBytes,
  fromHex,
  fromNumber,
  fromString,
  fromString2,
  getAbiItem,
  getAbortError,
  getAddress,
  getCallError,
  getChainContractAddress,
  getNodeError,
  hexToBigInt,
  hexToBool,
  hexToBytes,
  hexToNumber,
  integerRegex,
  isAbortError,
  isAddress,
  isAddressEqual,
  isHex,
  keccak256,
  keccak_256,
  localBatchGatewayUrl,
  multicall3Abi,
  multicall3Bytecode,
  numberToHex,
  pad,
  padLeft,
  padRight,
  parseAbi,
  parseAbiItem,
  parseAbiParameters,
  parseAccount,
  prettyPrint,
  serializeStateOverride,
  size,
  size2,
  size3,
  slice,
  slice2,
  slice3,
  stringToBytes,
  stringToHex,
  stringify,
  stringify2,
  textResolverAbi,
  toBigInt,
  toBoolean,
  toBytes,
  toEventSelector,
  toHex,
  toNumber,
  toNumber2,
  toRpc,
  toString,
  trim,
  trimLeft,
  trimLeft2,
  universalResolverResolveAbi,
  universalResolverReverseAbi,
  validate,
  validate2,
  withResolvers
} from "./chunk-D3NPNM5T.mjs";
import "./chunk-HUK5DCK4.mjs";
import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-RCVPDT3Q.mjs";

// ../node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// ../node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index2 = R++;
      debug(name, index2, value);
      t[name] = index2;
      src[index2] = value;
      safeSrc[index2] = safe;
      re[index2] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index2] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// ../node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier) => {
      const identifiers = identifier.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                const prereleaseBase = this.prerelease[identifier.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// ../node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse;
  }
});

// ../node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// ../node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// ../node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// ../node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison2 = v1.compare(v2);
      if (comparison2 === 0) {
        return null;
      }
      const v1Higher = comparison2 > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// ../node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// ../node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// ../node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// ../node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// ../node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// ../node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// ../node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// ../node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// ../node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// ../node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// ../node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt2 = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt2;
  }
});

// ../node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt2 = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt2;
  }
});

// ../node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq2 = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq2;
  }
});

// ../node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// ../node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte2 = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte2;
  }
});

// ../node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte2 = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte2;
  }
});

// ../node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq2 = require_eq();
    var neq = require_neq();
    var gt2 = require_gt();
    var gte2 = require_gte();
    var lt2 = require_lt();
    var lte2 = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq2(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt2(a, b, loose);
        case ">=":
          return gte2(a, b, loose);
        case "<":
          return lt2(a, b, loose);
        case "<=":
          return lte2(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// ../node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// ../node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "../node_modules/semver/functions/truncate.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var constants = require_constants();
    var SemVer = require_semver();
    var truncate = (version, truncation, options) => {
      if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    };
    var cloneInputVersion = (version, options) => {
      const versionStringToParse = version instanceof SemVer ? version.version : version;
      return parse(versionStringToParse, options);
    };
    var doTruncation = (version, truncation) => {
      if (isPrerelease(truncation)) {
        return version.version;
      }
      version.prerelease = [];
      switch (truncation) {
        case "major":
          version.minor = 0;
          version.patch = 0;
          break;
        case "minor":
          version.patch = 0;
          break;
      }
      return version.format();
    };
    var isPrerelease = (type) => {
      return type.startsWith("pre");
    };
    module.exports = truncate;
  }
});

// ../node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key2) {
        const value = this.map.get(key2);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key2);
          this.map.set(key2, value);
          return value;
        }
      }
      delete(key2) {
        return this.map.delete(key2);
      }
      set(key2, value) {
        const deleted = this.delete(key2);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key2, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// ../node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from15, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from15 = "";
      } else if (isX(fm)) {
        from15 = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from15 = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from15 = `>=${from15}`;
      } else {
        from15 = `>=${from15}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from15} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});

// ../node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// ../node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// ../node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// ../node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt2 = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt2(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt2(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// ../node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// ../node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt2 = require_gt();
    var lt2 = require_lt();
    var lte2 = require_lte();
    var gte2 = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt2;
          ltefn = lte2;
          ltfn = lt2;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt2;
          ltefn = gte2;
          ltfn = gt2;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// ../node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module.exports = gtr;
  }
});

// ../node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module.exports = ltr;
  }
});

// ../node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// ../node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt2, lt2;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt2 = higherGT(gt2, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt2 = lowerLT(lt2, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt2 && lt2) {
        gtltComp = compare(gt2.semver, lt2.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt2.operator !== ">=" || lt2.operator !== "<=")) {
          return null;
        }
      }
      for (const eq2 of eqSet) {
        if (gt2 && !satisfies(eq2, String(gt2), options)) {
          return null;
        }
        if (lt2 && !satisfies(eq2, String(lt2), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq2, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt2 && !options.includePrerelease && lt2.semver.prerelease.length ? lt2.semver : false;
      let needDomGTPre = gt2 && !options.includePrerelease && gt2.semver.prerelease.length ? gt2.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt2.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt2) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt2, c, options);
            if (higher === c && higher !== gt2) {
              return false;
            }
          } else if (gt2.operator === ">=" && !c.test(gt2.semver)) {
            return false;
          }
        }
        if (lt2) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt2, c, options);
            if (lower === c && lower !== lt2) {
              return false;
            }
          } else if (lt2.operator === "<=" && !c.test(lt2.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt2 || gt2) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt2 && hasDomLT && !lt2 && gtltComp !== 0) {
        return false;
      }
      if (lt2 && hasDomGT && !gt2 && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// ../node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt2 = require_gt();
    var lt2 = require_lt();
    var eq2 = require_eq();
    var neq = require_neq();
    var gte2 = require_gte();
    var lte2 = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt: gt2,
      lt: lt2,
      eq: eq2,
      neq,
      gte: gte2,
      lte: lte2,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// src/index.ts
import { appendFileSync } from "fs";

// ../packages/sdk/src/constants.ts
var PROJECT = "mene-v1";
var TIRAMISU = {
  chainId: 7738577,
  rpcUrl: "https://rpc.tiramisu.db-chain.testnet.arkiv.network",
  wsUrl: "wss://rpc.tiramisu.db-chain.testnet.arkiv.network",
  explorer: "https://tiramisu.explorer.arkiv.network"
};
var DEFAULT_THRESHOLD = 2;
var SEVERITIES = ["low", "moderate", "high", "critical"];
function isSeverity(s) {
  return SEVERITIES.includes(s);
}
function normalizeSeverity(s) {
  const v = s === "medium" ? "moderate" : s;
  return isSeverity(v) ? v : void 0;
}

// ../packages/sdk/src/osv.ts
var import_semver = __toESM(require_semver2(), 1);
var OsvValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "OsvValidationError";
  }
};
function parseOsv(raw) {
  const fail = (m) => {
    throw new OsvValidationError(m);
  };
  if (!raw || typeof raw !== "object") fail("advisory must be an object");
  const a = raw;
  for (const f of ["schema_version", "id", "modified", "published", "summary"]) {
    if (typeof a[f] !== "string" || !a[f].length) fail(`missing string field "${f}"`);
  }
  if (a.id.length > 64) fail("id longer than 64 characters");
  if (!Array.isArray(a.affected) || a.affected.length === 0) fail("affected must be a non-empty array");
  for (const [i, aff] of a.affected.entries()) {
    const p = aff?.package;
    if (!p || p.ecosystem !== "npm" || typeof p.name !== "string" || !p.name) {
      fail(`affected[${i}].package must be an npm package`);
    }
    for (const [j, r] of (aff.ranges ?? []).entries()) {
      if (!r || !Array.isArray(r.events) || r.events.length === 0)
        fail(`affected[${i}].ranges[${j}].events must be a non-empty array`);
      if (r.type !== "SEMVER") continue;
      for (const ev of r.events) {
        for (const [k, v2] of Object.entries(ev ?? {})) {
          if (!["introduced", "fixed", "last_affected"].includes(k))
            fail(`affected[${i}].ranges[${j}] has unknown event "${k}"`);
          if (typeof v2 !== "string" || v2 !== "0" && !import_semver.default.valid(v2))
            fail(`affected[${i}].ranges[${j}] event ${k}="${String(v2)}" is not semver`);
        }
      }
    }
    const v = aff.versions;
    if (v !== void 0 && (!Array.isArray(v) || v.some((x) => typeof x !== "string"))) {
      fail(`affected[${i}].versions must be strings`);
    }
  }
  if (a.references !== void 0) {
    if (!Array.isArray(a.references)) fail("references must be an array");
    for (const r of a.references) {
      if (typeof r?.url !== "string" || !isSafeUrl(r.url)) fail(`reference URL must be http(s): ${String(r?.url)}`);
    }
  }
  const mene = a.database_specific?.mene;
  if (!mene || typeof mene !== "object") fail("database_specific.mene is required");
  if (!isSeverity(String(mene.severity))) fail("database_specific.mene.severity must be low|moderate|high|critical");
  if (mene.recommended !== void 0 && !import_semver.default.valid(mene.recommended))
    fail("database_specific.mene.recommended must be a version");
  const src = mene.source;
  if (src !== void 0 && (typeof src.repo !== "string" || typeof src.path !== "string" || typeof src.license !== "string")) {
    fail("database_specific.mene.source must have repo, path and license");
  }
  return raw;
}
function isSafeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
var severityOf = (a) => a.database_specific.mene.severity;
var recommendedOf = (a, pkg = primaryPackage(a)) => pkg === primaryPackage(a) ? a.database_specific.mene.recommended : void 0;
function primaryPackage(a) {
  return a.affected[0].package.name;
}

// ../packages/sdk/src/lockfile.ts
var LockfileError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "LockfileError";
  }
};
function parseLockfile(text) {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new LockfileError("lockfile is not valid JSON");
  }
  if (!json || typeof json !== "object") throw new LockfileError("lockfile must be a JSON object");
  const lock = json;
  if (lock.packages && typeof lock.packages === "object") {
    const out = [];
    for (const [path, meta] of Object.entries(lock.packages)) {
      if (!path || !meta || meta.link || typeof meta.version !== "string") continue;
      const name = meta.name ?? nameFromPath(path);
      if (!name) continue;
      out.push({ name, version: meta.version, path });
    }
    return out;
  }
  if (lock.dependencies && typeof lock.dependencies === "object") {
    const out = [];
    walkV1(lock.dependencies, "", out);
    return out;
  }
  throw new LockfileError("unsupported lockfile: no `packages` or `dependencies` map");
}
function walkV1(deps, prefix, out) {
  for (const [name, dep] of Object.entries(deps)) {
    const path = `${prefix}node_modules/${name}`;
    if (typeof dep.version === "string") {
      const alias = dep.version.match(/^npm:((?:@[^/]+\/)?[^@]+)@(.+)$/);
      if (alias) out.push({ name: alias[1], version: alias[2], path });
      else if (!dep.version.includes(":")) out.push({ name, version: dep.version, path });
    }
    if (dep.dependencies) walkV1(dep.dependencies, `${path}/`, out);
  }
}
function nameFromPath(path) {
  const idx = path.lastIndexOf("node_modules/");
  if (idx === -1) return null;
  const rest = path.slice(idx + "node_modules/".length);
  const parts = rest.split("/");
  if (parts[0]?.startsWith("@")) return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  return parts[0] || null;
}

// ../packages/sdk/src/match.ts
var import_semver2 = __toESM(require_semver2(), 1);
function isAffected(aff, version) {
  if (aff.versions?.includes(version)) return true;
  if (!import_semver2.default.valid(version)) return false;
  return (aff.ranges ?? []).some((r) => inRange(r, version));
}
function inRange(range, version) {
  if (range.type !== "SEMVER" || !Array.isArray(range.events)) return false;
  const ok = (v) => v !== void 0 && (v === "0" || import_semver2.default.valid(v) !== null);
  let affected = false;
  const events = [...range.events].sort((a, b) => {
    const va = eventVersion(a);
    const vb = eventVersion(b);
    return import_semver2.default.compare(va, vb);
  });
  for (const ev of events) {
    if (ev.introduced !== void 0) {
      if (!ok(ev.introduced)) continue;
      const v = ev.introduced === "0" ? "0.0.0" : ev.introduced;
      if (import_semver2.default.gte(version, v)) affected = true;
    } else if (ev.fixed !== void 0) {
      if (!ok(ev.fixed)) continue;
      if (import_semver2.default.gte(version, ev.fixed)) affected = false;
    } else if (ev.last_affected !== void 0) {
      if (!ok(ev.last_affected)) continue;
      if (import_semver2.default.gt(version, ev.last_affected)) affected = false;
    }
  }
  return affected;
}
function eventVersion(ev) {
  const v = ev.introduced ?? ev.fixed ?? ev.last_affected ?? "0.0.0";
  return v === "0" ? "0.0.0" : import_semver2.default.valid(v) ?? "0.0.0";
}
function matchLockfile(installed, advisories, minSeverity = "low") {
  const min = SEVERITIES.indexOf(minSeverity);
  const byName = /* @__PURE__ */ new Map();
  for (const p of installed) {
    const list = byName.get(p.name) ?? [];
    list.push(p);
    byName.set(p.name, list);
  }
  const out = [];
  for (const { key: key2, status, advisory } of advisories) {
    const severity = severityOf(advisory);
    if (SEVERITIES.indexOf(severity) < min) continue;
    if (advisory.withdrawn) continue;
    for (const aff of advisory.affected) {
      for (const p of byName.get(aff.package.name) ?? []) {
        if (!isAffected(aff, p.version)) continue;
        out.push({
          advisoryId: advisory.id,
          advisoryKey: key2,
          package: p.name,
          installed: p.version,
          path: p.path,
          severity,
          status,
          safeVersion: recommendedOf(advisory, p.name),
          summary: advisory.summary
        });
      }
    }
  }
  return out;
}

// ../packages/sdk/src/quorum.ts
function emptyState() {
  return { version: 2, advisories: {}, attestations: {}, lastStatus: {}, wasStatus: {} };
}
var isRecord = (v) => !!v && typeof v === "object" && !Array.isArray(v);
function upgradeOsv(osv) {
  if (!isRecord(osv)) return void 0;
  const ds = isRecord(osv.database_specific) ? osv.database_specific : {};
  if (isRecord(ds.mene)) return osv;
  const sev = ds.severity === "medium" ? "moderate" : ds.severity;
  const affected = Array.isArray(osv.affected) ? osv.affected : [];
  const safe = affected.map((a) => isRecord(a?.database_specific) ? a.database_specific.safe_version : void 0).find((v) => typeof v === "string");
  const { mene_version: _v, severity: _s, ...rest } = ds;
  return {
    ...osv,
    affected: affected.map((a) => {
      if (!isRecord(a?.database_specific)) return a;
      const { safe_version: _sv, ...keep } = a.database_specific;
      return { ...a, database_specific: keep };
    }),
    database_specific: {
      ...rest,
      mene: { severity: typeof sev === "string" ? sev : "critical", ...safe ? { recommended: safe } : {} }
    }
  };
}
function migrateState(raw) {
  if (!isRecord(raw)) return void 0;
  const { version } = raw;
  if (version !== 1 && version !== 2) return void 0;
  for (const f of ["advisories", "attestations", "lastStatus", "wasStatus"]) {
    if (raw[f] !== void 0 && !isRecord(raw[f])) return void 0;
  }
  const advisories = {};
  for (const [k, a] of Object.entries(raw.advisories ?? {})) {
    if (!isRecord(a)) return void 0;
    const osv = version === 1 ? upgradeOsv(a.osv) : a.osv;
    if (!osv) return void 0;
    advisories[k] = { ...a, osv };
  }
  const attestations = {};
  for (const [k, a] of Object.entries(
    raw.attestations ?? {}
  )) {
    if (!isRecord(a) || typeof a.advisory !== "string" || typeof a.issuer !== "string") return void 0;
    attestations[k] = { ...a, attestedAt: a.attestedAt ?? a.issuedAt ?? 0 };
  }
  return {
    version: 2,
    advisories,
    attestations,
    lastStatus: raw.lastStatus ?? {},
    wasStatus: raw.wasStatus ?? {}
  };
}
var lc = (s) => s.toLowerCase();
function newer(a, b) {
  if (a.createdAt !== b.createdAt) return a.createdAt > b.createdAt;
  if (a.attestedAt !== b.attestedAt) return a.attestedAt > b.attestedAt;
  return a.key > b.key;
}
function resolveStatus(input2) {
  const trusted = new Set(input2.issuers.map(lc));
  const k = input2.threshold;
  const prev = input2.state ?? emptyState();
  const state = {
    version: 2,
    advisories: { ...prev.advisories },
    attestations: { ...prev.attestations },
    lastStatus: { ...prev.lastStatus },
    wasStatus: { ...prev.wasStatus ?? {} }
  };
  const liveKeys = /* @__PURE__ */ new Set();
  for (const a of input2.liveAttestations) {
    if (!trusted.has(lc(a.issuer))) continue;
    liveKeys.add(lc(a.key));
    state.attestations[lc(a.key)] = { ...a, key: lc(a.key), advisory: lc(a.advisory), issuer: lc(a.issuer) };
  }
  for (const [key2, adv] of Object.entries(input2.liveAdvisories)) {
    state.advisories[lc(key2)] = adv;
  }
  const byAdvisory = /* @__PURE__ */ new Map();
  for (const a of Object.values(state.attestations)) {
    if (!trusted.has(a.issuer)) continue;
    const list = byAdvisory.get(a.advisory) ?? [];
    list.push(a);
    byAdvisory.set(a.advisory, list);
  }
  for (const key2 of Object.keys(state.advisories)) if (!byAdvisory.has(key2)) byAdvisory.set(key2, []);
  const statuses = [];
  for (const [advKey, atts] of byAdvisory) {
    const latest = /* @__PURE__ */ new Map();
    for (const a of atts) {
      const cur = latest.get(a.issuer);
      if (!cur || newer(a, cur)) latest.set(a.issuer, a);
    }
    const witnesses = [...latest.values()].sort((a, b) => a.createdAt - b.createdAt);
    const confirmers = witnesses.filter((w) => w.verdict === "confirm").map((w) => w.issuer);
    const withdrawers = witnesses.filter((w) => w.verdict === "withdraw").map((w) => w.issuer);
    const replay = /* @__PURE__ */ new Map();
    let activated = false;
    for (const a of [...atts].sort((x, y) => newer(x, y) ? 1 : newer(y, x) ? -1 : 0)) {
      replay.set(a.issuer, a.verdict);
      if ([...replay.values()].filter((v) => v === "confirm").length >= k) activated = true;
    }
    const vanished = atts.filter((a) => !liveKeys.has(a.key));
    let quorum;
    if (withdrawers.length >= k) quorum = "WITHDRAWN";
    else if (activated) quorum = "ACTIVE";
    else quorum = "PENDING";
    const advisoryGone = !input2.liveAdvisories[advKey];
    const advisory = state.advisories[advKey];
    const before = prev.lastStatus[advKey];
    let status = quorum;
    let was;
    if (advisoryGone && quorum !== "WITHDRAWN" && (advisory || before || atts.length > 0)) {
      status = "MISSING";
      was = before === "MISSING" ? state.wasStatus[advKey] ?? quorum : before ?? quorum;
      state.wasStatus[advKey] = was;
    } else {
      delete state.wasStatus[advKey];
    }
    state.lastStatus[advKey] = status;
    const enforced = status === "ACTIVE" || status === "MISSING" && (was === "ACTIVE" || quorum === "ACTIVE");
    const label = status === "PENDING" ? `PENDING ${confirmers.length}/${k}` : status === "MISSING" ? `MISSING (was ${was ?? quorum})` : status;
    statuses.push({
      key: advKey,
      status,
      was,
      confirmers,
      withdrawers,
      activated,
      threshold: k,
      witnesses,
      vanished,
      advisory,
      advisoryGone,
      enforced,
      label
    });
  }
  statuses.sort((a, b) => (b.advisory?.createdAt ?? 0) - (a.advisory?.createdAt ?? 0));
  return { statuses, state };
}

// ../node_modules/viem/_esm/utils/getAction.js
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}

// ../node_modules/viem/_esm/errors/log.js
var FilterTypeNotSupportedError = class extends BaseError {
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
};

// ../node_modules/viem/_esm/utils/abi/encodeEventTopics.js
var docsPath = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
  const { abi: abi2, eventName, args } = parameters;
  let abiItem = abi2[0];
  if (eventName) {
    const item = getAbiItem({ abi: abi2, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "event")
    throw new AbiEventNotFoundError(void 0, { docsPath });
  let topics = [];
  if (args && "inputs" in abiItem) {
    const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
    if (args_.length > 0) {
      topics = indexedInputs?.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
        return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
      }) ?? [];
    }
  }
  if (abiItem.anonymous)
    return topics;
  const definition = formatAbiItem2(abiItem);
  const signature = toEventSelector(definition);
  return [signature, ...topics];
}
function encodeArg({ param, value }) {
  if (param.type === "string" || param.type === "bytes")
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
}

// ../node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
function createFilterRequestScope(client, { method }) {
  const requestMap = {};
  if (client.transport.type === "fallback")
    client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
      if (status === "success" && method === method_)
        requestMap[id] = transport.request;
    });
  return ((id) => requestMap[id] || client.request);
}

// ../node_modules/viem/_esm/actions/public/createContractEventFilter.js
async function createContractEventFilter(client, parameters) {
  const { address, abi: abi2, args, eventName, fromBlock, strict, toBlock: toBlock2 } = parameters;
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  const topics = eventName ? encodeEventTopics({
    abi: abi2,
    args,
    eventName
  }) : void 0;
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock2 === "bigint" ? numberToHex(toBlock2) : toBlock2,
        topics
      }
    ]
  });
  return {
    abi: abi2,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event"
  };
}

// ../node_modules/viem/_esm/utils/errors/getContractError.js
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi: abi2, address, args, docsPath: docsPath3, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError ? err.walk((err2) => typeof err2 === "object" && err2 !== null && "data" in err2) || err.walk() : {};
  const { code, data, details, message, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName, cause: err });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) {
      return new ContractFunctionRevertedError({
        abi: abi2,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message,
        cause: err
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi: abi2,
    args,
    contractAddress: address,
    docsPath: docsPath3,
    functionName,
    sender
  });
}

// ../node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}

// ../node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey({ hash: hash2, signature }) {
  const hashHex = isHex(hash2) ? hash2 : toHex(hash2);
  const { secp256k1: secp256k12 } = await import("./secp256k1-CASWGLXP.mjs");
  const signature_ = (() => {
    if (typeof signature === "object" && "r" in signature && "s" in signature) {
      const { r, s, v, yParity } = signature;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    if (size(signatureHex) !== 65)
      throw new Error("invalid signature length");
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1)
    return yParityOrV;
  if (yParityOrV === 27)
    return 0;
  if (yParityOrV === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
}

// ../node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash: hash2, signature }) {
  return publicKeyToAddress(await recoverPublicKey({ hash: hash2, signature }));
}

// ../node_modules/viem/_esm/utils/encoding/toRlp.js
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode5 } of list) {
        encode5(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError("Length is too large.");
}

// ../node_modules/viem/_esm/utils/authorization/hashAuthorization.js
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const hash2 = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash2);
  return hash2;
}

// ../node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}

// ../node_modules/viem/_esm/errors/estimateGas.js
var EstimateGasExecutionError = class extends BaseError {
  constructor(cause, { account, docsPath: docsPath3, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath3,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Estimate Gas Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "EstimateGasExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
};

// ../node_modules/viem/_esm/utils/errors/getEstimateGasError.js
function getEstimateGasError(err, { docsPath: docsPath3, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath: docsPath3,
    ...args
  });
}

// ../node_modules/viem/_esm/errors/fee.js
var BaseFeeScalarError = class extends BaseError {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
};
var Eip1559FeesNotSupportedError = class extends BaseError {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
};
var MaxFeePerGasTooLowError = class extends BaseError {
  constructor({ maxPriorityFeePerGas }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
};

// ../node_modules/viem/_esm/errors/block.js
var BlockNotFoundError = class extends BaseError {
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
};

// ../node_modules/viem/_esm/utils/formatters/transaction.js
var transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function formatTransaction(transaction, _) {
  const transaction_ = {
    ...transaction,
    blockHash: transaction.blockHash ? transaction.blockHash : null,
    blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
    ...transaction.blockTimestamp != null && {
      blockTimestamp: BigInt(transaction.blockTimestamp)
    },
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
    gas: transaction.gas ? BigInt(transaction.gas) : void 0,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
    maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
    maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
    to: transaction.to ? transaction.to : null,
    transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
    type: transaction.type ? transactionType[transaction.type] : void 0,
    typeHex: transaction.type ? transaction.type : void 0,
    value: transaction.value ? BigInt(transaction.value) : void 0,
    v: transaction.v ? BigInt(transaction.v) : void 0
  };
  if (transaction.authorizationList)
    transaction_.authorizationList = formatAuthorizationList(transaction.authorizationList);
  transaction_.yParity = (() => {
    if (transaction.yParity)
      return Number(transaction.yParity);
    if (typeof transaction_.v === "bigint") {
      if (transaction_.v === 0n || transaction_.v === 27n)
        return 0;
      if (transaction_.v === 1n || transaction_.v === 28n)
        return 1;
      if (transaction_.v >= 35n)
        return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return void 0;
  })();
  if (transaction_.type === "legacy") {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === "eip2930") {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === "eip1559")
    delete transaction_.maxFeePerBlobGas;
  return transaction_;
}
function formatAuthorizationList(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    r: authorization.r,
    s: authorization.s,
    yParity: Number(authorization.yParity)
  }));
}

// ../node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block, _) {
  const transactions = (block.transactions ?? []).map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return formatTransaction(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
    difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : void 0,
    timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}

// ../node_modules/viem/_esm/actions/public/getBlock.js
async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let block = null;
  if (blockHash) {
    block = await client.request({
      method: "eth_getBlockByHash",
      params: [blockHash, includeTransactions]
    }, { dedupe: true });
  } else {
    block = await client.request({
      method: "eth_getBlockByNumber",
      params: [blockNumberHex || blockTag, includeTransactions]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!block)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format2 = client.chain?.formatters?.block?.format || formatBlock;
  return format2(block, "getBlock");
}

// ../node_modules/viem/_esm/actions/public/getGasPrice.js
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}

// ../node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
async function estimateMaxPriorityFeePerGas(client, args) {
  return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const { block: block_, chain = client.chain, request } = args || {};
  try {
    const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
    if (typeof maxPriorityFeePerGas === "function") {
      const block = block_ || await getAction(client, getBlock, "getBlock")({});
      const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
        block,
        client,
        request
      });
      if (maxPriorityFeePerGas_ === null)
        throw new Error();
      return maxPriorityFeePerGas_;
    }
    if (typeof maxPriorityFeePerGas !== "undefined")
      return maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = await client.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}

// ../node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
async function estimateFeesPerGas(client, args) {
  return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
  const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === "function")
      return chain.fees.baseFeeMultiplier({
        block: block_,
        client,
        request
      });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1)
    throw new BaseFeeScalarError();
  const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = (base) => base * BigInt(Math.round(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
  if (typeof chain?.fees?.estimateFeesPerGas === "function") {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request,
      type
    });
    if (fees !== null)
      return fees;
  }
  if (type === "eip1559") {
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block,
      chain,
      request
    });
    const baseFeePerGas = multiply(block.baseFeePerGas);
    const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}

// ../node_modules/viem/_esm/actions/public/getTransactionCount.js
async function getTransactionCount(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [address, block]
  }, {
    dedupe: typeof blockNumber === "bigint" || blockHash !== void 0
  });
  return hexToNumber(count);
}

// ../node_modules/viem/_esm/utils/blob/blobsToCommitments.js
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}

// ../node_modules/viem/_esm/utils/blob/blobsToProofs.js
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}

// ../node_modules/@noble/hashes/esm/sha256.js
var sha2562 = sha256;

// ../node_modules/viem/_esm/utils/hash/sha256.js
function sha2563(value, to_) {
  const to = to_ || "hex";
  const bytes = sha2562(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}

// ../node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2563(commitment, "bytes");
  versionedHash.set([version], 0);
  return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}

// ../node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version
    }));
  }
  return hashes;
}

// ../node_modules/viem/_esm/constants/blob.js
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;

// ../node_modules/viem/_esm/errors/blob.js
var BlobSizeTooLargeError = class extends BaseError {
  constructor({ maxSize, size: size5 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size5} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
};
var EmptyBlobError = class extends BaseError {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
};

// ../node_modules/viem/_esm/utils/blob/toBlobs.js
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size5 = 0;
    while (size5 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size5++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}

// ../node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}

// ../node_modules/viem/_esm/utils/transaction/getTransactionType.js
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}

// ../node_modules/viem/_esm/utils/errors/getTransactionError.js
function getTransactionError(err, { docsPath: docsPath3, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new TransactionExecutionError(cause, {
    docsPath: docsPath3,
    ...args
  });
}

// ../node_modules/viem/_esm/actions/public/getChainId.js
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}

// ../node_modules/viem/_esm/actions/public/fillTransaction.js
async function fillTransaction(client, parameters) {
  const { account = client.account, accessList, authorizationList, chain = client.chain, blobVersionedHashes, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce: nonce_, nonceManager, to, type, value, ...rest } = parameters;
  const nonce = await (async () => {
    if (!account)
      return nonce_;
    if (!nonceManager)
      return nonce_;
    if (typeof nonce_ !== "undefined")
      return nonce_;
    const account_ = parseAccount(account);
    const chainId = chain ? chain.id : await getAction(client, getChainId, "getChainId")({});
    return await nonceManager.consume({
      address: account_.address,
      chainId,
      client
    });
  })();
  assertRequest(parameters);
  const chainFormat = chain?.formatters?.transactionRequest?.format;
  const format2 = chainFormat || formatTransactionRequest;
  const request = format2({
    // Pick out extra data that might exist on the chain's transaction request type.
    ...extract(rest, { format: chainFormat }),
    account: account ? parseAccount(account) : void 0,
    accessList,
    authorizationList,
    blobs,
    blobVersionedHashes,
    data,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    type,
    value
  }, "fillTransaction");
  try {
    const response = await client.request({
      method: "eth_fillTransaction",
      params: [request]
    });
    const format3 = chain?.formatters?.transaction?.format || formatTransaction;
    const transaction = format3(response.tx);
    delete transaction.blockHash;
    delete transaction.blockNumber;
    delete transaction.r;
    delete transaction.s;
    delete transaction.transactionIndex;
    delete transaction.v;
    delete transaction.yParity;
    transaction.data = transaction.input;
    const hasFeePayerSignature = typeof transaction.feePayerSignature !== "undefined" && transaction.feePayerSignature !== null;
    if (hasFeePayerSignature && typeof nonce !== "undefined" && transaction.nonce !== nonce)
      throw new FeePayerNonceMismatchError({
        filledNonce: transaction.nonce,
        requestedNonce: nonce
      });
    if (!hasFeePayerSignature) {
      if (transaction.gas)
        transaction.gas = parameters.gas ?? transaction.gas;
      if (transaction.gasPrice)
        transaction.gasPrice = parameters.gasPrice ?? transaction.gasPrice;
      if (transaction.maxFeePerBlobGas)
        transaction.maxFeePerBlobGas = parameters.maxFeePerBlobGas ?? transaction.maxFeePerBlobGas;
      if (transaction.maxFeePerGas)
        transaction.maxFeePerGas = parameters.maxFeePerGas ?? transaction.maxFeePerGas;
      if (transaction.maxPriorityFeePerGas)
        transaction.maxPriorityFeePerGas = parameters.maxPriorityFeePerGas ?? transaction.maxPriorityFeePerGas;
      if (typeof transaction.nonce !== "undefined")
        transaction.nonce = parameters.nonce ?? transaction.nonce;
      const feeMultiplier = await (async () => {
        if (typeof chain?.fees?.baseFeeMultiplier === "function") {
          const block = await getAction(client, getBlock, "getBlock")({});
          return chain.fees.baseFeeMultiplier({
            block,
            client,
            request: parameters
          });
        }
        return chain?.fees?.baseFeeMultiplier ?? 1.2;
      })();
      if (feeMultiplier < 1)
        throw new BaseFeeScalarError();
      const decimals = feeMultiplier.toString().split(".")[1]?.length ?? 0;
      const denominator = 10 ** decimals;
      const multiplyFee = (base) => base * BigInt(Math.round(feeMultiplier * denominator)) / BigInt(denominator);
      if (transaction.maxFeePerGas && !parameters.maxFeePerGas)
        transaction.maxFeePerGas = multiplyFee(transaction.maxFeePerGas);
      if (transaction.gasPrice && !parameters.gasPrice)
        transaction.gasPrice = multiplyFee(transaction.gasPrice);
    }
    return {
      raw: response.raw,
      transaction: {
        from: request.from,
        ...transaction
      },
      ...response.capabilities ? { capabilities: response.capabilities } : {}
    };
  } catch (err) {
    throw getTransactionError(err, {
      ...parameters,
      chain: client.chain
    });
  }
}

// ../node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
];
var eip1559NetworkCache = /* @__PURE__ */ new Map();
var supportsFillTransaction = /* @__PURE__ */ new LruMap(128);
async function prepareTransactionRequest(client, args) {
  let request = args;
  request.account ??= client.account;
  request.parameters ??= defaultParameters;
  const { account: account_, chain = client.chain, nonceManager, parameters } = request;
  const prepareTransactionRequest2 = (() => {
    if (typeof chain?.prepareTransactionRequest === "function")
      return {
        fn: chain.prepareTransactionRequest,
        runAt: ["beforeFillTransaction"]
      };
    if (Array.isArray(chain?.prepareTransactionRequest))
      return {
        fn: chain.prepareTransactionRequest[0],
        runAt: chain.prepareTransactionRequest[1].runAt
      };
    return void 0;
  })();
  let chainId;
  async function getChainId2() {
    if (chainId)
      return chainId;
    if (typeof request.chainId !== "undefined")
      return request.chainId;
    if (chain)
      return chain.id;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  let account = account_ ? parseAccount(account_) : account_;
  let nonce = request.nonce;
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillTransaction")) {
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "beforeFillTransaction"
    });
    nonce ??= request.nonce;
    const sender = request.account ?? request.from;
    account = sender ? parseAccount(sender) : void 0;
  }
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account && nonceManager) {
    const chainId2 = await getChainId2();
    nonce = await nonceManager.consume({
      address: account.address,
      chainId: chainId2,
      client
    });
  }
  const attemptFill = (() => {
    if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && request.kzg && request.blobs)
      return false;
    if (parameters.length > 0 && "feePayer" in request && request.feePayer && !("feePayerSignature" in request && request.feePayerSignature))
      return true;
    if (supportsFillTransaction.get(client.uid) === false)
      return false;
    const shouldAttempt = ["fees", "gas"].some((parameter) => parameters.includes(parameter));
    if (!shouldAttempt)
      return false;
    if (parameters.includes("chainId") && typeof request.chainId !== "number")
      return true;
    if (parameters.includes("nonce") && typeof nonce !== "number")
      return true;
    if (parameters.includes("fees") && typeof request.gasPrice !== "bigint" && (typeof request.maxFeePerGas !== "bigint" || typeof request.maxPriorityFeePerGas !== "bigint"))
      return true;
    if (parameters.includes("gas") && typeof request.gas !== "bigint")
      return true;
    return false;
  })();
  const fillResult = attemptFill ? await getAction(client, fillTransaction, "fillTransaction")({ ...request, nonce }).then((result) => {
    const { chainId: chainId2, from: from15, gas: gas2, gasPrice, nonce: nonce2, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, type: type2, ...rest } = result.transaction;
    const feeToken = "feeToken" in rest ? rest.feeToken : void 0;
    const hasFilledFeePayerSignature = "feePayerSignature" in rest && rest.feePayerSignature !== null && typeof rest.feePayerSignature !== "undefined";
    const shouldUseFilledFeeToken = typeof feeToken !== "undefined" && feeToken !== null && (!("feeToken" in request) || hasFilledFeePayerSignature);
    supportsFillTransaction.set(client.uid, true);
    return {
      ...request,
      ...from15 ? { from: from15 } : {},
      ...type2 && !request.type ? { type: type2 } : {},
      ...typeof chainId2 !== "undefined" ? { chainId: chainId2 } : {},
      ...typeof gas2 !== "undefined" ? { gas: gas2 } : {},
      ...typeof gasPrice !== "undefined" ? { gasPrice } : {},
      ...typeof nonce2 !== "undefined" ? { nonce: nonce2 } : {},
      ...typeof maxFeePerBlobGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerBlobGas } : {},
      ...typeof maxFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerGas } : {},
      ...typeof maxPriorityFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxPriorityFeePerGas } : {},
      ..."nonceKey" in rest && typeof rest.nonceKey !== "undefined" ? { nonceKey: rest.nonceKey } : {},
      ..."keyAuthorization" in rest && typeof rest.keyAuthorization !== "undefined" && rest.keyAuthorization !== null && !("keyAuthorization" in request) ? { keyAuthorization: rest.keyAuthorization } : {},
      ..."feePayerSignature" in rest && typeof rest.feePayerSignature !== "undefined" && rest.feePayerSignature !== null ? { feePayerSignature: rest.feePayerSignature } : {},
      ...shouldUseFilledFeeToken ? { feeToken } : {},
      ...result.capabilities ? { _capabilities: result.capabilities } : {}
    };
  }).catch((e) => {
    const error = e;
    if (error.name !== "TransactionExecutionError")
      return request;
    const nonceMismatch = error.walk?.((error2) => error2 instanceof FeePayerNonceMismatchError);
    if (nonceMismatch)
      throw e;
    const executionReverted = error.walk?.((e2) => {
      const error2 = e2;
      return error2.name === "ExecutionRevertedError";
    });
    if (executionReverted)
      throw e;
    const unsupported = error.walk?.((e2) => {
      const error2 = e2;
      return error2.name === "MethodNotFoundRpcError" || error2.name === "MethodNotSupportedRpcError" || error2.message?.includes("eth_fillTransaction is not available");
    });
    if (unsupported)
      supportsFillTransaction.set(client.uid, false);
    return request;
  }) : request;
  nonce ??= fillResult.nonce;
  request = {
    ...fillResult,
    ...account ? { from: account?.address } : {},
    ...typeof nonce !== "undefined" ? { nonce } : {}
  };
  const { blobs, gas, kzg, type } = request;
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillParameters")) {
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "beforeFillParameters"
    });
  }
  let block;
  async function getBlock2() {
    if (block)
      return block;
    block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
    return block;
  }
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account && !nonceManager)
    request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
      address: account.address,
      blockTag: "pending"
    });
  if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
    const commitments = blobsToCommitments({ blobs, kzg });
    if (parameters.includes("blobVersionedHashes")) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: "hex"
      });
      request.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes("sidecars")) {
      const proofs = blobsToProofs({ blobs, commitments, kzg });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: "hex"
      });
      request.sidecars = sidecars;
    }
  }
  if (parameters.includes("chainId"))
    request.chainId = await getChainId2();
  if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
    try {
      request.type = getTransactionType(request);
    } catch {
      let isEip1559Network = eip1559NetworkCache.get(client.uid);
      if (typeof isEip1559Network === "undefined") {
        const block2 = await getBlock2();
        isEip1559Network = typeof block2?.baseFeePerGas === "bigint";
        eip1559NetworkCache.set(client.uid, isEip1559Network);
      }
      request.type = isEip1559Network ? "eip1559" : "legacy";
    }
  }
  if (parameters.includes("fees")) {
    if (request.type !== "legacy" && request.type !== "eip2930") {
      if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
        const block2 = await getBlock2();
        const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request
        });
        if (typeof request.maxPriorityFeePerGas === "undefined" && request.maxFeePerGas && request.maxFeePerGas < maxPriorityFeePerGas)
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      if (typeof request.maxFeePerGas !== "undefined" || typeof request.maxPriorityFeePerGas !== "undefined")
        throw new Eip1559FeesNotSupportedError();
      if (typeof request.gasPrice === "undefined") {
        const block2 = await getBlock2();
        const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request,
          type: "legacy"
        });
        request.gasPrice = gasPrice_;
      }
    }
  }
  if (parameters.includes("gas") && typeof gas === "undefined")
    request.gas = await getAction(client, estimateGas, "estimateGas")({
      ...request,
      account,
      prepare: account?.type === "local" ? [] : ["blobVersionedHashes"]
    });
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("afterFillParameters"))
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "afterFillParameters"
    });
  assertRequest(request);
  delete request.parameters;
  return request;
}

// ../node_modules/viem/_esm/actions/public/estimateGas.js
async function estimateGas(client, args) {
  const { account: account_ = client.account, prepare = true } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  const parameters = (() => {
    if (Array.isArray(prepare))
      return prepare;
    if (account?.type !== "local")
      return ["blobVersionedHashes"];
    return void 0;
  })();
  try {
    const to = await (async () => {
      if (args.to)
        return args.to;
      if (args.authorizationList && args.authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: args.authorizationList[0]
        }).catch(() => {
          throw new BaseError("`to` is required. Could not infer from `authorizationList`");
        });
      return void 0;
    })();
    const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = prepare ? await prepareTransactionRequest(client, {
      ...args,
      parameters,
      to
    }) : args;
    if (gas && args.gas !== gas)
      return gas;
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    assertRequest(args);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      account,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    }, "estimateGas");
    return BigInt(await client.request({
      method: "eth_estimateGas",
      params: rpcStateOverride ? [
        request,
        block ?? client.experimental_blockTag ?? "latest",
        rpcStateOverride
      ] : block ? [request, block] : [request]
    }));
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// ../node_modules/viem/_esm/actions/public/estimateContractGas.js
async function estimateContractGas(client, parameters) {
  const { abi: abi2, address, args, functionName, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value, ...request } = parameters;
  const data = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const gas = await getAction(client, estimateGas, "estimateGas")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...request
    });
    return gas;
  } catch (error) {
    const account = request.account ? parseAccount(request.account) : void 0;
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/estimateContractGas",
      functionName,
      sender: account?.address
    });
  }
}

// ../node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log, { args, eventName } = {}) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    blockTimestamp: log.blockTimestamp ? BigInt(log.blockTimestamp) : log.blockTimestamp === null ? null : void 0,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}

// ../node_modules/viem/_esm/utils/abi/decodeEventLog.js
var docsPath2 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
  const { abi: abi2, data, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature, ...argTopics] = topics;
  if (!signature)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath2 });
  const abiItem = abi2.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem2(x)));
  if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath2 });
  const { name, inputs } = abiItem;
  const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
  const args = isUnnamed ? [] : {};
  const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
  const missingIndexedInputs = [];
  for (let i = 0; i < indexedInputs.length; i++) {
    const [param, argIndex] = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic) {
      if (strict)
        throw new DecodeLogTopicsMismatch({
          abiItem,
          param
        });
      missingIndexedInputs.push([param, argIndex]);
      continue;
    }
    args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
      param,
      value: topic
    });
  }
  const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
  const inputsToDecode = strict ? nonIndexedInputs : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
  if (inputsToDecode.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decodeAbiParameters(inputsToDecode, data);
        if (decodedData) {
          let dataIndex = 0;
          if (!strict) {
            for (const [param, argIndex] of missingIndexedInputs) {
              args[isUnnamed ? argIndex : param.name || argIndex] = decodedData[dataIndex++];
            }
          }
          if (isUnnamed) {
            for (let i = 0; i < inputs.length; i++)
              if (args[i] === void 0 && dataIndex < decodedData.length)
                args[i] = decodedData[dataIndex++];
          } else
            for (let i = 0; i < nonIndexedInputs.length; i++)
              args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
        }
      } catch (err) {
        if (strict) {
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem,
              data,
              params: inputsToDecode,
              size: size(data)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
        abiItem,
        data: "0x",
        params: inputsToDecode,
        size: 0
      });
    }
  }
  return {
    eventName: name,
    args: Object.values(args).length > 0 ? args : void 0
  };
}
function decodeTopic({ param, value }) {
  if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    return value;
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
}

// ../node_modules/viem/_esm/utils/abi/parseEventLogs.js
function parseEventLogs(parameters) {
  const { abi: abi2, args, logs, strict = true } = parameters;
  const eventName = (() => {
    if (!parameters.eventName)
      return void 0;
    if (Array.isArray(parameters.eventName))
      return parameters.eventName;
    return [parameters.eventName];
  })();
  const abiTopics = abi2.filter((abiItem) => abiItem.type === "event").map((abiItem) => ({
    abi: abiItem,
    selector: toEventSelector(abiItem)
  }));
  return logs.map((log) => {
    const formattedLog = typeof log.blockNumber === "string" ? formatLog(log) : log;
    const abiItems = abiTopics.filter((abiTopic) => formattedLog.topics[0] === abiTopic.selector);
    if (abiItems.length === 0)
      return null;
    let event;
    let abiItem;
    for (const item of abiItems) {
      try {
        event = decodeEventLog({
          ...formattedLog,
          abi: [item.abi],
          strict: true
        });
        abiItem = item;
        break;
      } catch {
      }
    }
    if (!event && !strict) {
      abiItem = abiItems[0];
      try {
        event = decodeEventLog({
          data: formattedLog.data,
          topics: formattedLog.topics,
          abi: [abiItem.abi],
          strict: false
        });
      } catch {
        const isUnnamed = abiItem.abi.inputs?.some((x) => !("name" in x && x.name));
        return {
          ...formattedLog,
          args: isUnnamed ? [] : {},
          eventName: abiItem.abi.name
        };
      }
    }
    if (!event || !abiItem)
      return null;
    if (eventName && !eventName.includes(event.eventName))
      return null;
    if (!includesArgs({
      args: event.args,
      inputs: abiItem.abi.inputs,
      matchArgs: args
    }))
      return null;
    return { ...event, ...formattedLog };
  }).filter(Boolean);
}
function includesArgs(parameters) {
  const { args, inputs, matchArgs } = parameters;
  if (!matchArgs)
    return true;
  if (!args)
    return false;
  function isEqual2(input2, value, arg) {
    try {
      if (input2.type === "address")
        return isAddressEqual(value, arg);
      if (input2.type === "string" || input2.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index2) => {
      if (value === null || value === void 0)
        return true;
      const input2 = inputs[index2];
      if (!input2)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual2(input2, value2, args[index2]));
    });
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    return Object.entries(matchArgs).every(([key2, value]) => {
      if (value === null || value === void 0)
        return true;
      const input2 = inputs.find((input3) => input3.name === key2);
      if (!input2)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual2(input2, value2, args[key2]));
    });
  return false;
}

// ../node_modules/viem/_esm/actions/public/getLogs.js
async function getLogs(client, { address, blockHash, fromBlock, toBlock: toBlock2, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : void 0);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args: events_ ? void 0 : args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  let logs;
  if (blockHash) {
    logs = await client.request({
      method: "eth_getLogs",
      params: [{ address, topics, blockHash }]
    });
  } else {
    logs = await client.request({
      method: "eth_getLogs",
      params: [
        {
          address,
          topics,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock2 === "bigint" ? numberToHex(toBlock2) : toBlock2
        }
      ]
    });
  }
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}

// ../node_modules/viem/_esm/actions/public/getContractEvents.js
async function getContractEvents(client, parameters) {
  const { abi: abi2, address, args, blockHash, eventName, fromBlock, toBlock: toBlock2, strict } = parameters;
  const event = eventName ? getAbiItem({ abi: abi2, name: eventName }) : void 0;
  const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
  return getAction(client, getLogs, "getLogs")({
    address,
    args,
    blockHash,
    event,
    events,
    fromBlock,
    toBlock: toBlock2,
    strict
  });
}

// ../node_modules/viem/_esm/actions/public/readContract.js
async function readContract(client, parameters) {
  const { abi: abi2, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}

// ../node_modules/viem/_esm/actions/public/simulateContract.js
async function simulateContract(client, parameters) {
  const { abi: abi2, address, args, functionName, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi: abi2, args, functionName });
  try {
    const { data } = await getAction(client, call, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
    const minimizedAbi = abi2.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
    return {
      result,
      request: {
        abi: minimizedAbi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account
      }
    };
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account?.address
    });
  }
}

// ../node_modules/viem/_esm/utils/observe.js
var listenersCache = /* @__PURE__ */ new Map();
var cleanupCache = /* @__PURE__ */ new Map();
var callbackCount = 0;
function observe(observerId, callbacks, fn) {
  const callbackId = ++callbackCount;
  const getListeners = () => listenersCache.get(observerId) || [];
  const unsubscribe = () => {
    const listeners2 = getListeners();
    const nextListeners = listeners2.filter((cb) => cb.id !== callbackId);
    if (nextListeners.length === 0) {
      listenersCache.delete(observerId);
      cleanupCache.delete(observerId);
      return;
    }
    listenersCache.set(observerId, nextListeners);
  };
  const unwatch = () => {
    const listeners2 = getListeners();
    if (!listeners2.some((cb) => cb.id === callbackId))
      return;
    const cleanup2 = cleanupCache.get(observerId);
    if (listeners2.length === 1 && cleanup2) {
      const p = cleanup2();
      if (p instanceof Promise)
        p.catch(() => {
        });
    }
    unsubscribe();
  };
  const listeners = getListeners();
  listenersCache.set(observerId, [
    ...listeners,
    { id: callbackId, fns: callbacks }
  ]);
  if (listeners && listeners.length > 0)
    return unwatch;
  const emit = {};
  for (const key2 in callbacks) {
    emit[key2] = ((...args) => {
      const listeners2 = getListeners();
      if (listeners2.length === 0)
        return;
      for (const listener of listeners2)
        listener.fns[key2]?.(...args);
    });
  }
  const cleanup = fn(emit);
  if (typeof cleanup === "function")
    cleanupCache.set(observerId, cleanup);
  return unwatch;
}

// ../node_modules/viem/_esm/utils/wait.js
async function wait(time, { signal } = {}) {
  return new Promise((resolve2, reject) => {
    if (signal?.aborted) {
      reject(getAbortError(signal));
      return;
    }
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const timeout = setTimeout(() => {
      cleanup();
      resolve2();
    }, time);
    const onAbort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(getAbortError(signal));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// ../node_modules/viem/_esm/utils/poll.js
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
  let active = true;
  const unwatch = () => active = false;
  const watch = async () => {
    let data;
    if (emitOnBegin)
      data = await fn({ unpoll: unwatch });
    const initialWait = await initialWaitTime?.(data) ?? interval;
    await wait(initialWait);
    const poll2 = async () => {
      if (!active)
        return;
      await fn({ unpoll: unwatch });
      await wait(interval);
      poll2();
    };
    poll2();
  };
  watch();
  return unwatch;
}

// ../node_modules/viem/_esm/utils/promise/withCache.js
var promiseCache = /* @__PURE__ */ new Map();
var responseCache = /* @__PURE__ */ new Map();
function getCache(cacheKey2) {
  const buildCache = (cacheKey3, cache) => ({
    clear: () => cache.delete(cacheKey3),
    get: () => cache.get(cacheKey3),
    set: (data) => cache.set(cacheKey3, data)
  });
  const promise = buildCache(cacheKey2, promiseCache);
  const response = buildCache(cacheKey2, responseCache);
  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response
  };
}
async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache = getCache(cacheKey2);
  const response = cache.response.get();
  if (response && cacheTime > 0) {
    const age = Date.now() - response.created.getTime();
    if (age < cacheTime)
      return response.data;
  }
  let promise = cache.promise.get();
  if (!promise) {
    promise = fn();
    cache.promise.set(promise);
  }
  try {
    const data = await promise;
    cache.response.set({ created: /* @__PURE__ */ new Date(), data });
    return data;
  } finally {
    cache.promise.clear();
  }
}

// ../node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = (id) => `blockNumber.${id}`;
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}

// ../node_modules/viem/_esm/actions/public/getFilterChanges.js
async function getFilterChanges(_client, { filter }) {
  const strict = "strict" in filter && filter.strict;
  const logs = await filter.request({
    method: "eth_getFilterChanges",
    params: [filter.id]
  });
  if (typeof logs[0] === "string")
    return logs;
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// ../node_modules/viem/_esm/actions/public/uninstallFilter.js
async function uninstallFilter(_client, { filter }) {
  return filter.request({
    method: "eth_uninstallFilter",
    params: [filter.id]
  });
}

// ../node_modules/viem/_esm/actions/public/watchContractEvent.js
function watchContractEvent(client, parameters) {
  const { abi: abi2, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const pollContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
              abi: abi2,
              address,
              args,
              eventName,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber < blockNumber) {
              logs = await getAction(client, getContractEvents, "getContractEvents")({
                abi: abi2,
                address,
                args,
                eventName,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber,
                strict
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict
    ]);
    let active = true;
    let unsubscribe = () => active = false;
    return observe(observerId, { onLogs, onError }, (emit) => {
      ;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const topics = eventName ? encodeEventTopics({
            abi: abi2,
            eventName,
            args
          }) : [];
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address, topics }],
            onData(data) {
              if (!active)
                return;
              const log = data.result;
              try {
                const { eventName: eventName2, args: args2 } = decodeEventLog({
                  abi: abi2,
                  data: log.data,
                  topics: log.topics,
                  strict: strict_
                });
                const formatted = formatLog(log, {
                  args: args2,
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              } catch (err) {
                let eventName2;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName2 = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                }
                const formatted = formatLog(log, {
                  args: isUnnamed ? [] : {},
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              }
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollContractEvent() : subscribeContractEvent();
}

// ../node_modules/viem/_esm/errors/account.js
var AccountNotFoundError = class extends BaseError {
  constructor({ docsPath: docsPath3 } = {}) {
    super([
      "Could not find an Account to execute with this Action.",
      "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
    ].join("\n"), {
      docsPath: docsPath3,
      docsSlug: "account",
      name: "AccountNotFoundError"
    });
  }
};

// ../node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
async function sendRawTransaction(client, { serializedTransaction }) {
  return client.request({
    method: "eth_sendRawTransaction",
    params: [serializedTransaction]
  }, { retryCount: 0 });
}

// ../node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = () => true, signal } = {}) {
  return new Promise((resolve2, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      if (signal?.aborted) {
        reject(getAbortError(signal));
        return;
      }
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay) {
          try {
            await wait(delay, { signal });
          } catch (err) {
            reject(err);
            return;
          }
        }
        return attemptRetry({ count: count + 1 });
      };
      try {
        const data = await fn();
        resolve2(data);
      } catch (err) {
        if (signal?.aborted) {
          reject(getAbortError(signal));
          return;
        }
        if (isAbortError(err)) {
          reject(err);
          return;
        }
        if (count < retryCount && await shouldRetry2({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    void attemptRetry().catch(reject);
  });
}

// ../node_modules/viem/_esm/utils/formatters/transactionReceipt.js
var receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success"
};
function formatTransactionReceipt(transactionReceipt, _) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
    contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
    gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
    logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
    status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
    type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
  };
  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
  return receipt;
}

// ../node_modules/viem/_esm/utils/uid.js
var size4 = 256;
var index = size4;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size4 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size4; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// ../node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, chain, ccipRead, dataSuffix, key: key2 = "base", name = "Base Client", tokens, type = "base" } = parameters;
  const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
  const blockTime = chain?.blockTime ?? 12e3;
  const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4e3);
  const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
  const cacheTime = parameters.cacheTime ?? pollingInterval;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  const { config, request, value } = parameters.transport({
    account,
    chain,
    pollingInterval
  });
  const transport = { ...config, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    dataSuffix,
    key: key2,
    name,
    pollingInterval,
    request,
    tokens,
    transport,
    type,
    uid: uid(),
    ...experimental_blockTag ? { experimental_blockTag } : {}
  };
  function extend(base) {
    return (extendFn) => {
      const extended = extendFn(base);
      for (const key3 in client)
        delete extended[key3];
      const combined = { ...base, ...extended };
      for (const key3 in extended) {
        const a = base[key3];
        const b = extended[key3];
        if (isPlainObject(a) && isPlainObject(b))
          combined[key3] = { ...a, ...b };
      }
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(client, { extend: extend(client) });
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function bindActionDecorators(client, action) {
  const wrapped = (parameters = {}) => action(client, parameters);
  for (const key2 of [
    "call",
    "calls",
    "callWithPeriod",
    "estimateGas",
    "prepare",
    "prepareRecipient",
    "predict",
    "simulate"
  ])
    if (Object.hasOwn(action, key2)) {
      const helper = action[key2];
      wrapped[key2] = (args = {}) => {
        if (helper.length === 1)
          return helper(args);
        return helper(client, args);
      };
    }
  for (const key2 of ["extractEvent", "extractEvents"])
    if (Object.hasOwn(action, key2))
      wrapped[key2] = action[key2];
  return wrapped;
}

// ../node_modules/viem/_esm/utils/ens/errors.js
function isNullUniversalResolverError(err) {
  if (!(err instanceof BaseError))
    return false;
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (!(cause instanceof ContractFunctionRevertedError))
    return false;
  if (cause.data?.errorName === "HttpError")
    return true;
  if (cause.data?.errorName === "ResolverError")
    return true;
  if (cause.data?.errorName === "ResolverNotContract")
    return true;
  if (cause.data?.errorName === "ResolverNotFound")
    return true;
  if (cause.data?.errorName === "ReverseAddressMismatch")
    return true;
  if (cause.data?.errorName === "UnsupportedResolverProfile")
    return true;
  return false;
}

// ../node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
function encodedLabelToLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash2 = `0x${label.slice(1, 65)}`;
  if (!isHex(hash2))
    return null;
  return hash2;
}

// ../node_modules/viem/_esm/utils/ens/namehash.js
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return bytesToHex(result);
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }
  return bytesToHex(result);
}

// ../node_modules/viem/_esm/utils/ens/encodeLabelhash.js
function encodeLabelhash(hash2) {
  return `[${hash2.slice(2)}]`;
}

// ../node_modules/viem/_esm/utils/ens/labelhash.js
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return bytesToHex(result);
  return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
}

// ../node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0)
    return new Uint8Array(1);
  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
  let offset = 0;
  const list = value.split(".");
  for (let i = 0; i < list.length; i++) {
    let encoded = stringToBytes(list[i]);
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
    bytes[offset] = encoded.length;
    bytes.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }
  if (bytes.byteLength !== offset + 1)
    return bytes.slice(0, offset + 1);
  return bytes;
}

// ../node_modules/viem/_esm/actions/ens/getEnsAddress.js
async function getEnsAddress(client, parameters) {
  const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  const args = (() => {
    if (coinType != null)
      return [namehash(name), BigInt(coinType)];
    return [namehash(name)];
  })();
  try {
    const functionData = encodeFunctionData({
      abi: addressResolverAbi,
      functionName: "addr",
      args
    });
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolveWithGateways",
      args: [
        toHex(packetToBytes(name)),
        functionData,
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const address = decodeAddress({ coinType, data: res[0], args });
    if (address === "0x")
      return null;
    if (trim(address) === "0x00")
      return null;
    return address;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}
function decodeAddress({ coinType, data, args }) {
  try {
    return decodeFunctionResult({
      abi: addressResolverAbi,
      args,
      functionName: "addr",
      data
    });
  } catch (err) {
    if (coinType == null)
      throw err;
    const address = trim(data);
    if (size(address) === 20)
      return getAddress(address);
    throw err;
  }
}

// ../node_modules/viem/_esm/errors/ens.js
var EnsAvatarInvalidMetadataError = class extends BaseError {
  constructor({ data }) {
    super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
      metaMessages: [
        "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
        "",
        `Provided data: ${JSON.stringify(data)}`
      ],
      name: "EnsAvatarInvalidMetadataError"
    });
  }
};
var EnsAvatarInvalidNftUriError = class extends BaseError {
  constructor({ reason }) {
    super(`ENS NFT avatar URI is invalid. ${reason}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
};
var EnsAvatarUriResolutionError = class extends BaseError {
  constructor({ uri }) {
    super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
};
var EnsAvatarUnsupportedNamespaceError = class extends BaseError {
  constructor({ namespace }) {
    super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
};

// ../node_modules/viem/_esm/utils/ens/avatar/utils.js
var networkRegex = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
async function isImageUri(uri) {
  try {
    const res = await fetch(uri, { method: "HEAD" });
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return contentType?.startsWith("image/");
    }
    return false;
  } catch (error) {
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    if (!Object.hasOwn(globalThis, "Image"))
      return false;
    return new Promise((resolve2) => {
      const img = new Image();
      img.onload = () => {
        resolve2(true);
      };
      img.onerror = () => {
        resolve2(false);
      };
      img.src = uri;
    });
  }
}
function getGateway(custom, defaultGateway) {
  if (!custom)
    return defaultGateway;
  if (custom.endsWith("/"))
    return custom.slice(0, -1);
  return custom;
}
function resolveAvatarUri({ uri, gatewayUrls }) {
  const isEncoded = base64Regex.test(uri);
  if (isEncoded)
    return { uri, isOnChain: true, isEncoded };
  const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
  const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
  const networkRegexMatch = uri.match(networkRegex);
  const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
  const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
  const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
  if (uri.startsWith("http") && !isIPNS && !isIPFS) {
    let replacedUri = uri;
    if (gatewayUrls?.arweave)
      replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
    return { uri: replacedUri, isOnChain: false, isEncoded: false };
  }
  if ((isIPNS || isIPFS) && target) {
    return {
      uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  if (protocol === "ar:/" && target) {
    return {
      uri: `${arweaveGateway}/${target}${subtarget || ""}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  let parsedUri = uri.replace(dataURIRegex, "");
  if (parsedUri.startsWith("<svg")) {
    parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
  }
  if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
    return {
      uri: parsedUri,
      isOnChain: true,
      isEncoded: false
    };
  }
  throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data) {
  if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
    throw new EnsAvatarInvalidMetadataError({ data });
  }
  return data.image || data.image_url || data.image_data;
}
async function getMetadataAvatarUri({ gatewayUrls, uri }) {
  try {
    const res = await fetch(uri).then((res2) => res2.json());
    const image = await parseAvatarUri({
      gatewayUrls,
      uri: getJsonImage(res)
    });
    return image;
  } catch {
    throw new EnsAvatarUriResolutionError({ uri });
  }
}
async function parseAvatarUri({ gatewayUrls, uri }) {
  const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
  if (isOnChain)
    return resolvedURI;
  const isImage = await isImageUri(resolvedURI);
  if (isImage)
    return resolvedURI;
  throw new EnsAvatarUriResolutionError({ uri });
}
function parseNftUri(uri_) {
  let uri = uri_;
  if (uri.startsWith("did:nft:")) {
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }
  const [reference, asset_namespace, tokenID] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");
  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
    throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
  if (!chainID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
  if (!contractAddress)
    throw new EnsAvatarInvalidNftUriError({
      reason: "Contract address not found"
    });
  if (!tokenID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
  if (!erc_namespace)
    throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(chainID, 10),
    namespace: erc_namespace.toLowerCase(),
    contractAddress,
    tokenID
  };
}
async function getNftTokenUri(client, { nft }) {
  if (nft.namespace === "erc721") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "tokenURI",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "tokenURI",
      args: [BigInt(nft.tokenID)]
    });
  }
  if (nft.namespace === "erc1155") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "uri",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "_id", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "uri",
      args: [BigInt(nft.tokenID)]
    });
  }
  throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}

// ../node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
  if (/eip155:/i.test(record))
    return parseNftAvatarUri(client, { gatewayUrls, record });
  return parseAvatarUri({ uri: record, gatewayUrls });
}
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
  const nft = parseNftUri(record);
  const nftUri = await getNftTokenUri(client, { nft });
  const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
  if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
    const encodedJson = isEncoded ? (
      // if it is encoded, decode it
      atob(resolvedNftUri.replace("data:application/json;base64,", ""))
    ) : (
      // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
      resolvedNftUri
    );
    const decoded = JSON.parse(encodedJson);
    return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
  }
  let uriTokenId = nft.tokenID;
  if (nft.namespace === "erc1155")
    uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
  return getMetadataAvatarUri({
    gatewayUrls,
    uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
  });
}

// ../node_modules/viem/_esm/actions/ens/getEnsText.js
async function getEnsText(client, parameters) {
  const { blockNumber, blockTag, key: key2, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      args: [
        toHex(packetToBytes(name)),
        encodeFunctionData({
          abi: textResolverAbi,
          functionName: "text",
          args: [namehash(name), key2]
        }),
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      functionName: "resolveWithGateways",
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const record = decodeFunctionResult({
      abi: textResolverAbi,
      functionName: "text",
      data: res[0]
    });
    return record === "" ? null : record;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}

// ../node_modules/viem/_esm/actions/ens/getEnsAvatar.js
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
  const record = await getAction(client, getEnsText, "getEnsText")({
    blockNumber,
    blockTag,
    key: "avatar",
    name,
    universalResolverAddress,
    gatewayUrls,
    strict
  });
  if (!record)
    return null;
  try {
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls
    });
  } catch {
    return null;
  }
}

// ../node_modules/viem/_esm/actions/ens/getEnsName.js
async function getEnsName(client, parameters) {
  const { address, blockNumber, blockTag, coinType = 60n, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverReverseAbi,
      args: [address, coinType, gatewayUrls ?? [localBatchGatewayUrl]],
      functionName: "reverseWithGateways",
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const [name] = await readContractAction(readContractParameters);
    return name || null;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}

// ../node_modules/viem/_esm/actions/ens/getEnsResolver.js
async function getEnsResolver(client, parameters) {
  const { blockNumber, blockTag, name } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    throw new Error(`${name} is not a valid ENS TLD (${tlds?.join(", ")}) for chain "${chain.name}" (id: ${chain.id}).`);
  const [resolverAddress] = await getAction(client, readContract, "readContract")({
    address: universalResolverAddress,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [
          { type: "address" },
          { type: "bytes32" },
          { type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "findResolver",
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag
  });
  return resolverAddress;
}

// ../node_modules/viem/_esm/actions/public/createAccessList.js
async function createAccessList(client, args) {
  const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  try {
    assertRequest(args);
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      account,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      to,
      value
    }, "createAccessList");
    const response = await client.request({
      method: "eth_createAccessList",
      params: [request, block]
    });
    if (response.error)
      throw new BaseError(response.error, { details: response.error });
    return {
      accessList: response.accessList,
      gasUsed: BigInt(response.gasUsed)
    };
  } catch (err) {
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// ../node_modules/viem/_esm/actions/public/createBlockFilter.js
async function createBlockFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newBlockFilter"
  });
  const id = await client.request({
    method: "eth_newBlockFilter"
  });
  return { id, request: getRequest(id), type: "block" };
}

// ../node_modules/viem/_esm/actions/public/createEventFilter.js
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock: toBlock2 } = {}) {
  const events = events_ ?? (event ? [event] : void 0);
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock2 === "bigint" ? numberToHex(toBlock2) : toBlock2,
        ...topics.length ? { topics } : {}
      }
    ]
  });
  return {
    abi: events,
    args,
    eventName: event ? event.name : void 0,
    fromBlock,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    toBlock: toBlock2,
    type: "event"
  };
}

// ../node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
async function createPendingTransactionFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newPendingTransactionFilter"
  });
  const id = await client.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id, request: getRequest(id), type: "transaction" };
}

// ../node_modules/viem/_esm/actions/public/getBalance.js
async function getBalance(client, { address, blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  if (client.batch?.multicall && client.chain?.contracts?.multicall3) {
    const multicall3Address = client.chain.contracts.multicall3.address;
    const calldata = encodeFunctionData({
      abi: multicall3Abi,
      functionName: "getEthBalance",
      args: [address]
    });
    const { data } = await getAction(client, call, "call")({
      to: multicall3Address,
      data: calldata,
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    return decodeFunctionResult({
      abi: multicall3Abi,
      functionName: "getEthBalance",
      args: [address],
      data: data || "0x"
    });
  }
  const balance = await client.request({
    method: "eth_getBalance",
    params: [address, block]
  });
  return BigInt(balance);
}

// ../node_modules/viem/_esm/actions/public/getBlobBaseFee.js
async function getBlobBaseFee(client) {
  const baseFee = await client.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(baseFee);
}

// ../node_modules/viem/_esm/actions/public/getBlockReceipts.js
async function getBlockReceipts(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest" } = {}) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const receipts = await client.request({
    method: "eth_getBlockReceipts",
    params: [blockHash || blockNumberHex || blockTag]
  }, { dedupe: Boolean(blockHash || blockNumberHex) });
  if (!receipts)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return receipts.map((receipt) => format2(receipt, "getBlockReceipts"));
}

// ../node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let count;
  if (blockHash) {
    count = await client.request({
      method: "eth_getBlockTransactionCountByHash",
      params: [blockHash]
    }, { dedupe: true });
  } else {
    count = await client.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [blockNumberHex || blockTag]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  return hexToNumber(count);
}

// ../node_modules/viem/_esm/actions/public/getCode.js
async function getCode(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const hex = await client.request({
    method: "eth_getCode",
    params: [address, block]
  }, {
    dedupe: typeof blockNumber === "bigint" || blockHash !== void 0
  });
  if (hex === "0x")
    return void 0;
  return hex;
}

// ../node_modules/viem/_esm/actions/public/getDelegation.js
async function getDelegation(client, { address, blockNumber, blockTag = "latest" }) {
  const code = await getCode(client, {
    address,
    ...blockNumber !== void 0 ? { blockNumber } : { blockTag }
  });
  if (!code)
    return void 0;
  if (size(code) !== 23)
    return void 0;
  if (!code.startsWith("0xef0100"))
    return void 0;
  return getAddress(slice(code, 3, 23));
}

// ../node_modules/viem/_esm/errors/eip712.js
var Eip712DomainNotFoundError = class extends BaseError {
  constructor({ address }) {
    super(`No EIP-712 domain found on contract "${address}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${address}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification."
      ],
      name: "Eip712DomainNotFoundError"
    });
  }
};

// ../node_modules/viem/_esm/actions/public/getEip712Domain.js
async function getEip712Domain(client, parameters) {
  const { address, factory, factoryData } = parameters;
  try {
    const [fields, name, version, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
      abi,
      address,
      functionName: "eip712Domain",
      factory,
      factoryData
    });
    return {
      domain: {
        name,
        version,
        chainId: Number(chainId),
        verifyingContract,
        salt
      },
      extensions,
      fields
    };
  } catch (e) {
    const error = e;
    if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
      throw new Eip712DomainNotFoundError({ address });
    }
    throw error;
  }
}
var abi = [
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// ../node_modules/viem/_esm/utils/formatters/feeHistory.js
function formatFeeHistory(feeHistory) {
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
  };
}

// ../node_modules/viem/_esm/actions/public/getFeeHistory.js
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
  const feeHistory = await client.request({
    method: "eth_feeHistory",
    params: [
      numberToHex(blockCount),
      blockNumberHex || blockTag,
      rewardPercentiles
    ]
  }, { dedupe: Boolean(blockNumberHex) });
  return formatFeeHistory(feeHistory);
}

// ../node_modules/viem/_esm/actions/public/getFilterLogs.js
async function getFilterLogs(_client, { filter }) {
  const strict = filter.strict ?? false;
  const logs = await filter.request({
    method: "eth_getFilterLogs",
    params: [filter.id]
  });
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// ../node_modules/viem/_esm/utils/abi/encodePacked.js
function encodePacked(types, values) {
  if (types.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: types.length,
      givenLength: values.length
    });
  const data = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const value = values[i];
    data.push(encode(type, value));
  }
  return concatHex(data);
}
function encode(type, value, isArray = false) {
  if (type === "address") {
    const address = value;
    if (!isAddress(address))
      throw new InvalidAddressError({ address });
    return pad(address.toLowerCase(), {
      size: isArray ? 32 : null
    });
  }
  if (type === "string")
    return stringToHex(value);
  if (type === "bytes")
    return value;
  if (type === "bool")
    return pad(boolToHex(value), { size: isArray ? 32 : 1 });
  const intMatch = type.match(integerRegex);
  if (intMatch) {
    const [_type, baseType, bits = "256"] = intMatch;
    const size5 = Number.parseInt(bits, 10) / 8;
    return numberToHex(value, {
      size: isArray ? 32 : size5,
      signed: baseType === "int"
    });
  }
  const bytesMatch = type.match(bytesRegex);
  if (bytesMatch) {
    const [_type, size5] = bytesMatch;
    if (Number.parseInt(size5, 10) !== (value.length - 2) / 2)
      throw new BytesSizeMismatchError({
        expectedSize: Number.parseInt(size5, 10),
        givenSize: (value.length - 2) / 2
      });
    return pad(value, { dir: "right", size: isArray ? 32 : null });
  }
  const arrayMatch = type.match(arrayRegex);
  if (arrayMatch && Array.isArray(value)) {
    const [_type, childType] = arrayMatch;
    const data = [];
    for (let i = 0; i < value.length; i++) {
      data.push(encode(childType, value[i], true));
    }
    if (data.length === 0)
      return "0x";
    return concatHex(data);
  }
  throw new UnsupportedPackedAbiType(type);
}

// ../node_modules/viem/_esm/utils/authorization/verifyAuthorization.js
async function verifyAuthorization({ address, authorization, signature }) {
  return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
    authorization,
    signature
  }));
}

// ../node_modules/viem/_esm/utils/promise/withDedupe.js
var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache2.get(id))
    return promiseCache2.get(id);
  const promise = fn().finally(() => promiseCache2.delete(id));
  promiseCache2.set(id, promise);
  return promise;
}

// ../node_modules/viem/_esm/utils/buildRequest.js
function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, methods, retryDelay = 150, retryCount = 3, signal, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const { method } = args;
    if (methods?.exclude?.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (methods?.include && !methods.include.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (signal?.aborted)
      throw getAbortError(signal);
    const requestId = dedupe ? hashString(`${uid2}.${stringify(args)}`) : void 0;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args, signal ? { signal } : void 0);
      } catch (err_) {
        if (signal?.aborted)
          throw getAbortError(signal);
        if (isAbortError(err_))
          throw err_;
        const err = err_;
        switch (err.code) {
          // -32700
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          // -32600
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          // -32601
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          // -32602
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          // -32603
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          // -32000
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          // -32001
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          // -32002
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          // -32003
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          // -32004
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          // -32005
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          // -32006
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          // 4001
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          // 4100
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          // 4200
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          // 4900
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          // 4901
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          // 4902
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          // 5700
          case UnsupportedNonOptionalCapabilityError.code:
            throw new UnsupportedNonOptionalCapabilityError(err);
          // 5710
          case UnsupportedChainIdError.code:
            throw new UnsupportedChainIdError(err);
          // 5720
          case DuplicateIdError.code:
            throw new DuplicateIdError(err);
          // 5730
          case UnknownBundleIdError.code:
            throw new UnknownBundleIdError(err);
          // 5740
          case BundleTooLargeError.code:
            throw new BundleTooLargeError(err);
          // 5750
          case AtomicReadyWalletRejectedUpgradeError.code:
            throw new AtomicReadyWalletRejectedUpgradeError(err);
          // 5760
          case AtomicityNotSupportedError.code:
            throw new AtomicityNotSupportedError(err);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5e3:
            throw new UserRejectedRequestError(err);
          // WalletConnect: Session Settlement Failed
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
          case WalletConnectSessionSettlementError.code:
            throw new WalletConnectSessionSettlementError(err);
          default:
            if (err_ instanceof BaseError)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter, 10) * 1e3;
        }
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      signal,
      shouldRetry: ({ error }) => shouldRetry(error)
    }), { enabled: dedupe, id: requestId });
  };
}
function shouldRetry(error) {
  if (isAbortError(error))
    return false;
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    if (error.code === 429)
      return true;
    if (error.code === -32007)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}
function hashString(str2, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0; i < str2.length; i++) {
    const ch = str2.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 16, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 16, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// ../node_modules/viem/_esm/utils/chain/defineChain.js
function defineChain(chain) {
  const chainInstance = {
    formatters: void 0,
    fees: void 0,
    serializers: void 0,
    ...chain
  };
  function extend(base) {
    return (fnOrExtended) => {
      const properties = typeof fnOrExtended === "function" ? fnOrExtended(base) : fnOrExtended;
      const combined = { ...base, ...properties };
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(chainInstance, {
    extend: extend(chainInstance)
  });
}

// ../node_modules/viem/_esm/utils/promise/withTimeout.js
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve2, reject) => {
    ;
    (async () => {
      let timeoutId;
      const controller = new AbortController();
      try {
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve2(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (controller?.signal.aborted && isAbortError(err)) {
          reject(errorInstance);
          return;
        }
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}

// ../node_modules/viem/_esm/utils/rpc/id.js
function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
var idCache = /* @__PURE__ */ createIdStore();

// ../node_modules/viem/_esm/utils/rpc/http.js
var defaultMaxResponseBodySize = 10485760;
function getHttpRpcClient(url_, options = {}) {
  const { url, headers: headers_url } = parseUrl(url_);
  return {
    async request(params) {
      const { body, fetchFn = options.fetchFn ?? fetch, maxResponseBodySize = options.maxResponseBodySize ?? defaultMaxResponseBodySize, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const { response, responseBody } = await withTimeout(async ({ signal: timeoutSignal }) => {
          const { signal, cleanup } = anySignal([
            signal_,
            timeout > 0 ? timeoutSignal : null
          ]);
          try {
            const init = {
              ...fetchOptions,
              body: Array.isArray(body) ? stringify(body.map((body2) => ({
                jsonrpc: "2.0",
                id: body2.id ?? idCache.take(),
                ...body2
              }))) : stringify({
                jsonrpc: "2.0",
                id: body.id ?? idCache.take(),
                ...body
              }),
              headers: {
                ...headers_url,
                "Content-Type": "application/json",
                ...headers
              },
              method: method || "POST",
              signal
            };
            const request = new Request(url, init);
            const args = await onRequest?.(request, init) ?? {
              ...init,
              url
            };
            const response2 = await fetchFn(args.url ?? url, args);
            if (onResponse)
              await onResponse(response2);
            const responseBody2 = await readResponseBody(response2, {
              maxResponseBodySize
            });
            return { response: response2, responseBody: responseBody2 };
          } finally {
            cleanup();
          }
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        let data;
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data = JSON.parse(responseBody);
        else {
          data = responseBody;
          try {
            data = JSON.parse(data || "{}");
          } catch (err) {
            if (response.ok)
              throw err;
            data = { error: data };
          }
        }
        if (!response.ok) {
          if (typeof data.error?.code === "number" && typeof data.error?.message === "string")
            return data;
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (signal_?.aborted)
          throw getAbortError(signal_);
        if (isAbortError(err))
          throw err;
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof ResponseBodyTooLargeError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}
function anySignal(signals) {
  const signals_ = signals.filter((signal) => !!signal);
  if (signals_.length < 2)
    return { signal: signals_[0] ?? null, cleanup: () => {
    } };
  const controller = new AbortController();
  const onAbort = () => {
    cleanup();
    controller.abort(signals_.find((signal) => signal.aborted)?.reason);
  };
  const cleanup = () => {
    for (const signal of signals_)
      signal.removeEventListener("abort", onAbort);
  };
  for (const signal of signals_) {
    if (signal.aborted) {
      cleanup();
      controller.abort(signal.reason);
      break;
    }
    signal.addEventListener("abort", onAbort);
  }
  return { signal: controller.signal, cleanup };
}
async function readResponseBody(response, { maxResponseBodySize }) {
  if (maxResponseBodySize === false)
    return response.text();
  const contentLength = response.headers.get("Content-Length");
  if (contentLength) {
    const size6 = Number(contentLength);
    if (size6 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size6
      });
  }
  if (!response.body) {
    const body2 = await response.text();
    const size6 = new TextEncoder().encode(body2).length;
    if (size6 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size6
      });
    return body2;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let size5 = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      size5 += value.byteLength;
      if (size5 > maxResponseBodySize) {
        await reader.cancel();
        throw new ResponseBodyTooLargeError({
          maxSize: maxResponseBodySize,
          size: size5
        });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return body;
  } finally {
    reader.releaseLock();
  }
}
function parseUrl(url_) {
  try {
    const url = new URL(url_);
    const result = (() => {
      if (url.username) {
        const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
        url.username = "";
        url.password = "";
        return {
          url: url.toString(),
          headers: { Authorization: `Basic ${btoa(credentials)}` }
        };
      }
      return;
    })();
    return { url: url.toString(), ...result };
  } catch {
    return { url: url_ };
  }
}

// ../node_modules/viem/_esm/utils/rpc/socket.js
var socketClientCache = /* @__PURE__ */ new Map();
async function getSocketRpcClient(parameters) {
  const { getSocket: getSocket2, keepAlive = true, key: key2 = "socket", reconnect = true, url } = parameters;
  const { interval: keepAliveInterval = 3e4 } = typeof keepAlive === "object" ? keepAlive : {};
  const { attempts = 5, delay = 2e3 } = typeof reconnect === "object" ? reconnect : {};
  const id = JSON.stringify({ keepAlive, key: key2, url, reconnect });
  let socketClient = socketClientCache.get(id);
  if (socketClient)
    return socketClient;
  let reconnectCount = 0;
  const { schedule } = createBatchScheduler({
    id,
    fn: async () => {
      const requests = /* @__PURE__ */ new Map();
      const subscriptions = /* @__PURE__ */ new Map();
      let error;
      let socket;
      let keepAliveTimer;
      let reconnectTimer;
      let reconnectInProgress = false;
      let intentionallyClosed = false;
      function attemptReconnect() {
        if (reconnect && !intentionallyClosed && reconnectCount < attempts) {
          if (reconnectInProgress)
            return;
          reconnectInProgress = true;
          reconnectCount++;
          socket?.close();
          reconnectTimer = setTimeout(async () => {
            reconnectTimer = void 0;
            if (intentionallyClosed) {
              reconnectInProgress = false;
              return;
            }
            await setup().catch(console.error);
            reconnectInProgress = false;
          }, delay);
        } else {
          requests.clear();
          subscriptions.clear();
        }
      }
      async function setup() {
        const result = await getSocket2({
          onClose() {
            for (const request of requests.values())
              request.onError?.(new SocketClosedError({ url }));
            for (const subscription of subscriptions.values())
              subscription.onError?.(new SocketClosedError({ url }));
            attemptReconnect();
          },
          onError(error_) {
            error = error_;
            for (const request of requests.values())
              request.onError?.(error);
            for (const subscription of subscriptions.values())
              subscription.onError?.(error);
            attemptReconnect();
          },
          onOpen() {
            error = void 0;
            reconnectCount = 0;
          },
          onResponse(data) {
            const isSubscription = data.method === "eth_subscription";
            const id2 = isSubscription ? data.params.subscription : data.id;
            const cache = isSubscription ? subscriptions : requests;
            const callback = cache.get(id2);
            if (callback)
              callback.onResponse(data);
            if (!isSubscription)
              cache.delete(id2);
          }
        });
        if (intentionallyClosed) {
          result.close();
          return result;
        }
        socket = result;
        if (keepAlive) {
          if (keepAliveTimer)
            clearInterval(keepAliveTimer);
          keepAliveTimer = setInterval(() => socket.ping?.(), keepAliveInterval);
        }
        if (reconnect && subscriptions.size > 0) {
          const subscriptionEntries = subscriptions.entries();
          for (const [key3, { onResponse, body, onError }] of subscriptionEntries) {
            if (!body)
              continue;
            subscriptions.delete(key3);
            socketClient?.request({ body, onResponse, onError });
          }
        }
        return result;
      }
      await setup();
      error = void 0;
      socketClient = {
        close() {
          intentionallyClosed = true;
          keepAliveTimer && clearInterval(keepAliveTimer);
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = void 0;
            reconnectInProgress = false;
          }
          socket.close();
          socketClientCache.delete(id);
        },
        get socket() {
          return socket;
        },
        request({ body, onError, onResponse }) {
          if (error && onError)
            onError(error);
          const id2 = body.id ?? idCache.take();
          const callback = (response) => {
            if (typeof response.id === "number" && id2 !== response.id)
              return;
            if (body.method === "eth_subscribe" && typeof response.result === "string")
              subscriptions.set(response.result, {
                onResponse,
                onError,
                body
              });
            onResponse(response);
          };
          if (body.method === "eth_unsubscribe")
            subscriptions.delete(body.params?.[0]);
          requests.set(id2, { onResponse: callback, onError });
          try {
            socket.request({
              body: {
                jsonrpc: "2.0",
                id: id2,
                ...body
              }
            });
          } catch (error2) {
            onError?.(error2);
          }
        },
        requestAsync({ body, timeout = 1e4 }) {
          const id2 = body.id ?? idCache.take();
          return withTimeout(() => new Promise((onResponse, onError) => this.request({
            body: { ...body, id: id2 },
            onError,
            onResponse
          })), {
            errorInstance: new TimeoutError({ body, url }),
            timeout
          }).finally(() => requests.delete(id2));
        },
        requests,
        subscriptions,
        url
      };
      socketClientCache.set(id, socketClient);
      return [socketClient];
    }
  });
  const [_, [socketClient_]] = await schedule();
  return socketClient_;
}

// ../node_modules/viem/_esm/utils/rpc/webSocket.js
async function getWebSocketRpcClient(url, options = {}) {
  const { keepAlive, reconnect } = options;
  return getSocketRpcClient({
    async getSocket({ onClose, onError, onOpen, onResponse }) {
      const WebSocket = await import("./_esm-6V6NYNVG.mjs").then((module) => module.WebSocket);
      const socket = new WebSocket(url);
      function onClose_() {
        socket.removeEventListener("close", onClose_);
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("open", onOpen);
        onClose();
      }
      function onMessage({ data }) {
        if (typeof data === "string" && data.trim().length === 0)
          return;
        try {
          const _data = JSON.parse(data);
          onResponse(_data);
        } catch (error) {
          onError(error);
        }
      }
      socket.addEventListener("close", onClose_);
      socket.addEventListener("message", onMessage);
      socket.addEventListener("error", onError);
      socket.addEventListener("open", onOpen);
      if (socket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve2, reject) => {
          if (!socket)
            return;
          socket.onopen = resolve2;
          socket.onerror = reject;
        });
      }
      const { close: close_ } = socket;
      return Object.assign(socket, {
        close() {
          close_.bind(socket)();
          onClose_();
        },
        ping() {
          try {
            if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
              throw new WebSocketRequestError({
                url: socket.url,
                cause: new SocketClosedError({ url: socket.url })
              });
            const body = {
              jsonrpc: "2.0",
              id: null,
              method: "net_version",
              params: []
            };
            socket.send(JSON.stringify(body));
          } catch (error) {
            onError(error);
          }
        },
        request({ body }) {
          if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
            throw new WebSocketRequestError({
              body,
              url: socket.url,
              cause: new SocketClosedError({ url: socket.url })
            });
          return socket.send(JSON.stringify(body));
        }
      });
    },
    keepAlive,
    reconnect,
    url
  });
}

// ../node_modules/viem/_esm/utils/rpc/compat.js
async function getSocket(url) {
  const client = await getWebSocketRpcClient(url);
  return Object.assign(client.socket, {
    requests: client.requests,
    subscriptions: client.subscriptions
  });
}

// ../node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = "Ethereum Signed Message:\n";

// ../node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}

// ../node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

// ../node_modules/viem/_esm/errors/typedData.js
var InvalidDomainError = class extends BaseError {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
};
var InvalidPrimaryTypeError = class extends BaseError {
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
};
var InvalidStructTypeError = class extends BaseError {
  constructor({ type }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
};
var InvalidTypedDataTypeError = class extends BaseError {
  constructor({ type }) {
    const canonicalType = type.replace(/^(u?int)/, "$&256");
    super(`Type "${type}" is not a valid EIP-712 type.`, {
      metaMessages: [`Use "${canonicalType}" instead.`],
      name: "InvalidTypedDataTypeError"
    });
  }
};

// ../node_modules/viem/_esm/utils/typedData.js
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const baseType = type.replace(/(\[[0-9]*\])+$/, "");
      if (baseType === "int" || baseType === "uint")
        throw new InvalidTypedDataTypeError({ type });
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base, size_] = integerMatch;
        numberToHex(value, {
          signed: base === "int",
          size: Number.parseInt(size_, 10) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_, 10))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_, 10),
            givenSize: size(value)
          });
      }
      const struct2 = types[type];
      if (struct2) {
        validateReference(type);
        validateData(struct2, value);
      }
    }
  };
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}

// ../node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
function hashStruct({ data, primaryType, types }) {
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData({ data, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}
function encodeField({ types, name, type, value }) {
  if (types[type] !== void 0) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes")
    return [{ type: "bytes32" }, keccak256(value)];
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}

// ../node_modules/ox/_esm/erc8010/SignatureErc8010.js
var SignatureErc8010_exports = {};
__export(SignatureErc8010_exports, {
  InvalidWrappedSignatureError: () => InvalidWrappedSignatureError,
  assert: () => assert4,
  from: () => from9,
  magicBytes: () => magicBytes,
  suffixParameters: () => suffixParameters,
  unwrap: () => unwrap,
  validate: () => validate4,
  wrap: () => wrap
});

// ../node_modules/ox/_esm/core/internal/lru.js
var LruMap2 = class extends Map {
  constructor(size5) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size5;
  }
  get(key2) {
    const value = super.get(key2);
    if (super.has(key2) && value !== void 0) {
      this.delete(key2);
      super.set(key2, value);
    }
    return value;
  }
  set(key2, value) {
    super.set(key2, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey)
        this.delete(firstKey);
    }
    return this;
  }
};

// ../node_modules/ox/_esm/core/Caches.js
var caches = {
  checksum: /* @__PURE__ */ new LruMap2(8192)
};
var checksum = caches.checksum;

// ../node_modules/ox/_esm/core/Hash.js
function keccak2562(value, options = {}) {
  const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const bytes = keccak_256(from(value));
  if (as === "Bytes")
    return bytes;
  return fromBytes(bytes);
}

// ../node_modules/ox/_esm/core/PublicKey.js
function assert(publicKey, options = {}) {
  const { compressed } = options;
  const { prefix, x, y } = publicKey;
  if (compressed === false || typeof x === "bigint" && typeof y === "bigint") {
    if (prefix !== 4)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidUncompressedPrefixError()
      });
    return;
  }
  if (compressed === true || typeof x === "bigint" && typeof y === "undefined") {
    if (prefix !== 3 && prefix !== 2)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidCompressedPrefixError()
      });
    return;
  }
  throw new InvalidError({ publicKey });
}
function from3(value) {
  const publicKey = (() => {
    if (validate2(value))
      return fromHex2(value);
    if (validate(value))
      return fromBytes2(value);
    const { prefix, x, y } = value;
    if (typeof x === "bigint" && typeof y === "bigint")
      return { prefix: prefix ?? 4, x, y };
    return { prefix, x };
  })();
  assert(publicKey);
  return publicKey;
}
function fromBytes2(publicKey) {
  return fromHex2(fromBytes(publicKey));
}
function fromHex2(publicKey) {
  if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68)
    throw new InvalidSerializedSizeError({ publicKey });
  if (publicKey.length === 130) {
    const x2 = BigInt(slice3(publicKey, 0, 32));
    const y = BigInt(slice3(publicKey, 32, 64));
    return {
      prefix: 4,
      x: x2,
      y
    };
  }
  if (publicKey.length === 132) {
    const prefix2 = Number(slice3(publicKey, 0, 1));
    const x2 = BigInt(slice3(publicKey, 1, 33));
    const y = BigInt(slice3(publicKey, 33, 65));
    return {
      prefix: prefix2,
      x: x2,
      y
    };
  }
  const prefix = Number(slice3(publicKey, 0, 1));
  const x = BigInt(slice3(publicKey, 1, 33));
  return {
    prefix,
    x
  };
}
function toHex2(publicKey, options = {}) {
  assert(publicKey);
  const { prefix, x, y } = publicKey;
  const { includePrefix = true } = options;
  const publicKey_ = concat2(
    includePrefix ? fromNumber(prefix, { size: 1 }) : "0x",
    fromNumber(x, { size: 32 }),
    // If the public key is not compressed, add the y coordinate.
    typeof y === "bigint" ? fromNumber(y, { size: 32 }) : "0x"
  );
  return publicKey_;
}
var InvalidError = class extends BaseError2 {
  constructor({ publicKey }) {
    super(`Value \`${stringify2(publicKey)}\` is not a valid public key.`, {
      metaMessages: [
        "Public key must contain:",
        "- an `x` and `prefix` value (compressed)",
        "- an `x`, `y`, and `prefix` value (uncompressed)"
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidError"
    });
  }
};
var InvalidPrefixError = class extends BaseError2 {
  constructor({ prefix, cause }) {
    super(`Prefix "${prefix}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidPrefixError"
    });
  }
};
var InvalidCompressedPrefixError = class extends BaseError2 {
  constructor() {
    super("Prefix must be 2 or 3 for compressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidCompressedPrefixError"
    });
  }
};
var InvalidUncompressedPrefixError = class extends BaseError2 {
  constructor() {
    super("Prefix must be 4 for uncompressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidUncompressedPrefixError"
    });
  }
};
var InvalidSerializedSizeError = class extends BaseError2 {
  constructor({ publicKey }) {
    super(`Value \`${publicKey}\` is an invalid public key size.`, {
      metaMessages: [
        "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
        `Received ${size3(from2(publicKey))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidSerializedSizeError"
    });
  }
};

// ../node_modules/ox/_esm/core/Address.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
function assert2(value, options = {}) {
  const { strict = true } = options;
  if (!addressRegex.test(value))
    throw new InvalidAddressError2({
      address: value,
      cause: new InvalidInputError()
    });
  if (strict) {
    if (value.toLowerCase() === value)
      return;
    if (checksum2(value) !== value)
      throw new InvalidAddressError2({
        address: value,
        cause: new InvalidChecksumError()
      });
  }
}
function checksum2(address) {
  if (checksum.has(address))
    return checksum.get(address);
  assert2(address, { strict: false });
  const hexAddress = address.substring(2).toLowerCase();
  const hash2 = keccak2562(fromString(hexAddress), { as: "Bytes" });
  const characters = hexAddress.split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && characters[i]) {
      characters[i] = characters[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && characters[i + 1]) {
      characters[i + 1] = characters[i + 1].toUpperCase();
    }
  }
  const result = `0x${characters.join("")}`;
  checksum.set(address, result);
  return result;
}
function from4(address, options = {}) {
  const { checksum: checksumVal = false } = options;
  assert2(address);
  if (checksumVal)
    return checksum2(address);
  return address;
}
function fromPublicKey(publicKey, options = {}) {
  const address = keccak2562(`0x${toHex2(publicKey).slice(4)}`).substring(26);
  return from4(`0x${address}`, options);
}
function validate3(address, options = {}) {
  const { strict = true } = options ?? {};
  try {
    assert2(address, { strict });
    return true;
  } catch {
    return false;
  }
}
var InvalidAddressError2 = class extends BaseError2 {
  constructor({ address, cause }) {
    super(`Address "${address}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidAddressError"
    });
  }
};
var InvalidInputError = class extends BaseError2 {
  constructor() {
    super("Address is not a 20 byte (40 hexadecimal character) value.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidInputError"
    });
  }
};
var InvalidChecksumError = class extends BaseError2 {
  constructor() {
    super("Address does not match its checksum counterpart.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidChecksumError"
    });
  }
};

// ../node_modules/ox/_esm/core/Solidity.js
var arrayRegex2 = /^(.*)\[([0-9]*)\]$/;
var bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var maxInt8 = 2n ** (8n - 1n) - 1n;
var maxInt16 = 2n ** (16n - 1n) - 1n;
var maxInt24 = 2n ** (24n - 1n) - 1n;
var maxInt32 = 2n ** (32n - 1n) - 1n;
var maxInt40 = 2n ** (40n - 1n) - 1n;
var maxInt48 = 2n ** (48n - 1n) - 1n;
var maxInt56 = 2n ** (56n - 1n) - 1n;
var maxInt64 = 2n ** (64n - 1n) - 1n;
var maxInt72 = 2n ** (72n - 1n) - 1n;
var maxInt80 = 2n ** (80n - 1n) - 1n;
var maxInt88 = 2n ** (88n - 1n) - 1n;
var maxInt96 = 2n ** (96n - 1n) - 1n;
var maxInt104 = 2n ** (104n - 1n) - 1n;
var maxInt112 = 2n ** (112n - 1n) - 1n;
var maxInt120 = 2n ** (120n - 1n) - 1n;
var maxInt128 = 2n ** (128n - 1n) - 1n;
var maxInt136 = 2n ** (136n - 1n) - 1n;
var maxInt144 = 2n ** (144n - 1n) - 1n;
var maxInt152 = 2n ** (152n - 1n) - 1n;
var maxInt160 = 2n ** (160n - 1n) - 1n;
var maxInt168 = 2n ** (168n - 1n) - 1n;
var maxInt176 = 2n ** (176n - 1n) - 1n;
var maxInt184 = 2n ** (184n - 1n) - 1n;
var maxInt192 = 2n ** (192n - 1n) - 1n;
var maxInt200 = 2n ** (200n - 1n) - 1n;
var maxInt208 = 2n ** (208n - 1n) - 1n;
var maxInt216 = 2n ** (216n - 1n) - 1n;
var maxInt224 = 2n ** (224n - 1n) - 1n;
var maxInt232 = 2n ** (232n - 1n) - 1n;
var maxInt240 = 2n ** (240n - 1n) - 1n;
var maxInt248 = 2n ** (248n - 1n) - 1n;
var maxInt256 = 2n ** (256n - 1n) - 1n;
var minInt8 = -(2n ** (8n - 1n));
var minInt16 = -(2n ** (16n - 1n));
var minInt24 = -(2n ** (24n - 1n));
var minInt32 = -(2n ** (32n - 1n));
var minInt40 = -(2n ** (40n - 1n));
var minInt48 = -(2n ** (48n - 1n));
var minInt56 = -(2n ** (56n - 1n));
var minInt64 = -(2n ** (64n - 1n));
var minInt72 = -(2n ** (72n - 1n));
var minInt80 = -(2n ** (80n - 1n));
var minInt88 = -(2n ** (88n - 1n));
var minInt96 = -(2n ** (96n - 1n));
var minInt104 = -(2n ** (104n - 1n));
var minInt112 = -(2n ** (112n - 1n));
var minInt120 = -(2n ** (120n - 1n));
var minInt128 = -(2n ** (128n - 1n));
var minInt136 = -(2n ** (136n - 1n));
var minInt144 = -(2n ** (144n - 1n));
var minInt152 = -(2n ** (152n - 1n));
var minInt160 = -(2n ** (160n - 1n));
var minInt168 = -(2n ** (168n - 1n));
var minInt176 = -(2n ** (176n - 1n));
var minInt184 = -(2n ** (184n - 1n));
var minInt192 = -(2n ** (192n - 1n));
var minInt200 = -(2n ** (200n - 1n));
var minInt208 = -(2n ** (208n - 1n));
var minInt216 = -(2n ** (216n - 1n));
var minInt224 = -(2n ** (224n - 1n));
var minInt232 = -(2n ** (232n - 1n));
var minInt240 = -(2n ** (240n - 1n));
var minInt248 = -(2n ** (248n - 1n));
var minInt256 = -(2n ** (256n - 1n));
var maxUint8 = 2n ** 8n - 1n;
var maxUint16 = 2n ** 16n - 1n;
var maxUint24 = 2n ** 24n - 1n;
var maxUint32 = 2n ** 32n - 1n;
var maxUint40 = 2n ** 40n - 1n;
var maxUint48 = 2n ** 48n - 1n;
var maxUint56 = 2n ** 56n - 1n;
var maxUint64 = 2n ** 64n - 1n;
var maxUint72 = 2n ** 72n - 1n;
var maxUint80 = 2n ** 80n - 1n;
var maxUint88 = 2n ** 88n - 1n;
var maxUint96 = 2n ** 96n - 1n;
var maxUint104 = 2n ** 104n - 1n;
var maxUint112 = 2n ** 112n - 1n;
var maxUint120 = 2n ** 120n - 1n;
var maxUint128 = 2n ** 128n - 1n;
var maxUint136 = 2n ** 136n - 1n;
var maxUint144 = 2n ** 144n - 1n;
var maxUint152 = 2n ** 152n - 1n;
var maxUint160 = 2n ** 160n - 1n;
var maxUint168 = 2n ** 168n - 1n;
var maxUint176 = 2n ** 176n - 1n;
var maxUint184 = 2n ** 184n - 1n;
var maxUint192 = 2n ** 192n - 1n;
var maxUint200 = 2n ** 200n - 1n;
var maxUint208 = 2n ** 208n - 1n;
var maxUint216 = 2n ** 216n - 1n;
var maxUint224 = 2n ** 224n - 1n;
var maxUint232 = 2n ** 232n - 1n;
var maxUint240 = 2n ** 240n - 1n;
var maxUint248 = 2n ** 248n - 1n;
var maxUint256 = 2n ** 256n - 1n;

// ../node_modules/ox/_esm/core/internal/abiParameters.js
function decodeParameter(cursor, param, options) {
  const { checksumAddress: checksumAddress2, staticPosition } = options;
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { checksumAddress: checksumAddress2, length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition
    });
  if (param.type === "address")
    return decodeAddress2(cursor, { checksum: checksumAddress2 });
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidTypeError(param.type);
}
var sizeOfLength = 32;
var sizeOfOffset = 32;
function decodeAddress2(cursor, options = {}) {
  const { checksum: checksum3 = false } = options;
  const value = cursor.readBytes(32);
  const wrap3 = (address) => checksum3 ? checksum2(address) : address;
  return [wrap3(fromBytes(slice2(value, -20))), 32];
}
function decodeArray(cursor, param, options) {
  const { checksumAddress: checksumAddress2, length, staticPosition } = options;
  if (length === null) {
    const offset = toNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = toNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = toNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
    if (consumed_ === 0) {
      cursor.assertReadLimit();
      cursor._touch();
    }
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size5] = param.type.split("bytes");
  if (!size5) {
    const offset = toNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = toNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [fromBytes(data), 32];
  }
  const value = fromBytes(cursor.readBytes(Number.parseInt(size5, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size5 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size5 > 48 ? toBigInt(value, { signed }) : toNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, options) {
  const { checksumAddress: checksumAddress2, staticPosition } = options;
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = toNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        checksumAddress: checksumAddress2,
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      checksumAddress: checksumAddress2,
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = toNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = toNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = toString(trimLeft(data));
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function prepareParameters({ checksumAddress: checksumAddress2, parameters, values }) {
  const preparedParameters = [];
  for (let i = 0; i < parameters.length; i++) {
    preparedParameters.push(prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: parameters[i],
      value: values[i]
    }));
  }
  return preparedParameters;
}
function prepareParameter({ checksumAddress: checksumAddress2 = false, parameter: parameter_, value }) {
  const parameter = parameter_;
  const arrayComponents = getArrayComponents(parameter.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, {
      checksumAddress: checksumAddress2,
      length,
      parameter: {
        ...parameter,
        type
      }
    });
  }
  if (parameter.type === "tuple") {
    return encodeTuple(value, {
      checksumAddress: checksumAddress2,
      parameter
    });
  }
  if (parameter.type === "address") {
    return encodeAddress(value, {
      checksum: checksumAddress2
    });
  }
  if (parameter.type === "bool") {
    return encodeBoolean(value);
  }
  if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
    const signed = parameter.type.startsWith("int");
    const [, , size5 = "256"] = integerRegex2.exec(parameter.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size5)
    });
  }
  if (parameter.type.startsWith("bytes")) {
    return encodeBytes(value, { type: parameter.type });
  }
  if (parameter.type === "string") {
    return encodeString(value);
  }
  throw new InvalidTypeError(parameter.type);
}
function encode2(preparedParameters) {
  let staticSize = 0;
  for (let i = 0; i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size3(encoded);
  }
  const staticParameters = [];
  const dynamicParameters = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic) {
      staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
      dynamicParameters.push(encoded);
      dynamicSize += size3(encoded);
    } else {
      staticParameters.push(encoded);
    }
  }
  return concat2(...staticParameters, ...dynamicParameters);
}
function encodeAddress(value, options) {
  const { checksum: checksum3 = false } = options;
  assert2(value, { strict: checksum3 });
  return {
    dynamic: false,
    encoded: padLeft(value.toLowerCase())
  };
}
function encodeArray(value, options) {
  const { checksumAddress: checksumAddress2, length, parameter } = options;
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new ArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${parameter.type}[${length}]`
    });
  let dynamicChild = value.length === 0 && hasDynamicChild(parameter);
  const preparedParameters = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter,
      value: value[i]
    });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParameters.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encode2(preparedParameters);
    if (dynamic) {
      const length2 = fromNumber(preparedParameters.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParameters.length > 0 ? concat2(length2, data) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { type }) {
  const [, parametersize] = type.split("bytes");
  const bytesSize = size3(value);
  if (!parametersize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
    return {
      dynamic: true,
      encoded: concat2(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
    };
  }
  if (bytesSize !== Number.parseInt(parametersize, 10))
    throw new BytesSizeMismatchError2({
      expectedSize: Number.parseInt(parametersize, 10),
      value
    });
  return { dynamic: false, encoded: padRight(value) };
}
function encodeBoolean(value) {
  if (typeof value !== "boolean")
    throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
}
function encodeNumber(value, { signed, size: size5 }) {
  if (typeof size5 === "number") {
    const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size5 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: fromNumber(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = fromString2(value);
  const partsLength = Math.ceil(size3(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padRight(slice3(hexValue, i * 32, (i + 1) * 32)));
  }
  return {
    dynamic: true,
    encoded: concat2(padRight(fromNumber(size3(hexValue), { size: 32 })), ...parts)
  };
}
function encodeTuple(value, options) {
  const { checksumAddress: checksumAddress2, parameter } = options;
  let dynamic = false;
  const preparedParameters = [];
  for (let i = 0; i < parameter.components.length; i++) {
    const param_ = parameter.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: param_,
      value: value[index2]
    });
    preparedParameters.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encode2(preparedParameters) : concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({
    ...param,
    type: arrayComponents[1]
  }))
    return true;
  return false;
}

// ../node_modules/ox/_esm/core/internal/cursor.js
var staticCursor = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: /* @__PURE__ */ new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit)
      throw new RecursiveReadLimitExceededError({
        count: this.recursiveReadCount + 1,
        limit: this.recursiveReadLimit
      });
  },
  assertPosition(position) {
    if (position < 0 || position > this.bytes.length - 1)
      throw new PositionOutOfBoundsError2({
        length: this.bytes.length,
        position
      });
  },
  decrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError({ offset });
    const position = this.position - offset;
    this.assertPosition(position);
    this.position = position;
  },
  getReadCount(position) {
    return this.positionReadCount.get(position || this.position) || 0;
  },
  incrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError({ offset });
    const position = this.position + offset;
    this.assertPosition(position);
    this.position = position;
  },
  inspectByte(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectBytes(length, position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + length - 1);
    return this.bytes.subarray(position, position + length);
  },
  inspectUint8(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectUint16(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 1);
    return this.dataView.getUint16(position);
  },
  inspectUint24(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 2);
    return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
  },
  inspectUint32(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 3);
    return this.dataView.getUint32(position);
  },
  pushByte(byte) {
    this.assertPosition(this.position);
    this.bytes[this.position] = byte;
    this.position++;
  },
  pushBytes(bytes) {
    this.assertPosition(this.position + bytes.length - 1);
    this.bytes.set(bytes, this.position);
    this.position += bytes.length;
  },
  pushUint8(value) {
    this.assertPosition(this.position);
    this.bytes[this.position] = value;
    this.position++;
  },
  pushUint16(value) {
    this.assertPosition(this.position + 1);
    this.dataView.setUint16(this.position, value);
    this.position += 2;
  },
  pushUint24(value) {
    this.assertPosition(this.position + 2);
    this.dataView.setUint16(this.position, value >> 8);
    this.dataView.setUint8(this.position + 2, value & ~4294967040);
    this.position += 3;
  },
  pushUint32(value) {
    this.assertPosition(this.position + 3);
    this.dataView.setUint32(this.position, value);
    this.position += 4;
  },
  readByte() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectByte();
    this.position++;
    return value;
  },
  readBytes(length, size5) {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectBytes(length);
    this.position += size5 ?? length;
    return value;
  },
  readUint8() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint8();
    this.position += 1;
    return value;
  },
  readUint16() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint16();
    this.position += 2;
    return value;
  },
  readUint24() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint24();
    this.position += 3;
    return value;
  },
  readUint32() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint32();
    this.position += 4;
    return value;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(position) {
    const oldPosition = this.position;
    this.assertPosition(position);
    this.position = position;
    return () => this.position = oldPosition;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
      return;
    const count = this.getReadCount();
    this.positionReadCount.set(this.position, count + 1);
    if (count > 0)
      this.recursiveReadCount++;
  }
};
function create(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var NegativeOffsetError = class extends BaseError2 {
  constructor({ offset }) {
    super(`Offset \`${offset}\` cannot be negative.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.NegativeOffsetError"
    });
  }
};
var PositionOutOfBoundsError2 = class extends BaseError2 {
  constructor({ length, position }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.PositionOutOfBoundsError"
    });
  }
};
var RecursiveReadLimitExceededError = class extends BaseError2 {
  constructor({ count, limit }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.RecursiveReadLimitExceededError"
    });
  }
};

// ../node_modules/ox/_esm/core/AbiParameters.js
function decode(parameters, data, options = {}) {
  const { as = "Array", checksumAddress: checksumAddress2 = false } = options;
  const bytes = typeof data === "string" ? fromHex(data) : data;
  const cursor = create(bytes);
  if (size2(bytes) === 0 && parameters.length > 0)
    throw new ZeroDataError();
  if (size2(bytes) && size2(bytes) < 32)
    throw new DataSizeTooSmallError({
      data: typeof data === "string" ? data : fromBytes(data),
      parameters,
      size: size2(bytes)
    });
  let consumed = 0;
  const values = as === "Array" ? [] : {};
  for (let i = 0; i < parameters.length; ++i) {
    const param = parameters[i];
    if (consumed < bytes.length)
      cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition: 0
    });
    consumed += consumed_;
    if (as === "Array")
      values.push(data2);
    else
      values[param.name ?? i] = data2;
  }
  return values;
}
function encode3(parameters, values, options) {
  const { checksumAddress: checksumAddress2 = false } = options ?? {};
  if (parameters.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: parameters.length,
      givenLength: values.length
    });
  const preparedParameters = prepareParameters({
    checksumAddress: checksumAddress2,
    parameters,
    values
  });
  const data = encode2(preparedParameters);
  if (data.length === 0)
    return "0x";
  return data;
}
function encodePacked2(types, values) {
  if (types.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: types.length,
      givenLength: values.length
    });
  const data = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const value = values[i];
    data.push(encodePacked2.encode(type, value));
  }
  return concat2(...data);
}
(function(encodePacked3) {
  function encode5(type, value, isArray = false) {
    if (type === "address") {
      const address = value;
      assert2(address);
      return padLeft(address.toLowerCase(), isArray ? 32 : 0);
    }
    if (type === "string")
      return fromString2(value);
    if (type === "bytes")
      return value;
    if (type === "bool")
      return padLeft(fromBoolean(value), isArray ? 32 : 1);
    const intMatch = type.match(integerRegex2);
    if (intMatch) {
      const [_type, baseType, bits = "256"] = intMatch;
      const size5 = Number.parseInt(bits, 10) / 8;
      return fromNumber(value, {
        size: isArray ? 32 : size5,
        signed: baseType === "int"
      });
    }
    const bytesMatch = type.match(bytesRegex2);
    if (bytesMatch) {
      const [_type, size5] = bytesMatch;
      if (Number.parseInt(size5, 10) !== (value.length - 2) / 2)
        throw new BytesSizeMismatchError2({
          expectedSize: Number.parseInt(size5, 10),
          value
        });
      return padRight(value, isArray ? 32 : 0);
    }
    const arrayMatch = type.match(arrayRegex2);
    if (arrayMatch && Array.isArray(value)) {
      const [_type, childType] = arrayMatch;
      const data = [];
      for (let i = 0; i < value.length; i++) {
        data.push(encode5(childType, value[i], true));
      }
      if (data.length === 0)
        return "0x";
      return concat2(...data);
    }
    throw new InvalidTypeError(type);
  }
  encodePacked3.encode = encode5;
})(encodePacked2 || (encodePacked2 = {}));
function from5(parameters) {
  if (Array.isArray(parameters) && typeof parameters[0] === "string")
    return parseAbiParameters(parameters);
  if (typeof parameters === "string")
    return parseAbiParameters(parameters);
  return parameters;
}
var DataSizeTooSmallError = class extends BaseError2 {
  constructor({ data, parameters, size: size5 }) {
    super(`Data size of ${size5} bytes is too small for given parameters.`, {
      metaMessages: [
        `Params: (${formatAbiParameters(parameters)})`,
        `Data:   ${data} (${size5} bytes)`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.DataSizeTooSmallError"
    });
  }
};
var ZeroDataError = class extends BaseError2 {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.');
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.ZeroDataError"
    });
  }
};
var ArrayLengthMismatchError = class extends BaseError2 {
  constructor({ expectedLength, givenLength, type }) {
    super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.ArrayLengthMismatchError"
    });
  }
};
var BytesSizeMismatchError2 = class extends BaseError2 {
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size3(value)}) does not match expected size (bytes${expectedSize}).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.BytesSizeMismatchError"
    });
  }
};
var LengthMismatchError = class extends BaseError2 {
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding parameters/values length mismatch.",
      `Expected length (parameters): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.LengthMismatchError"
    });
  }
};
var InvalidArrayError = class extends BaseError2 {
  constructor(value) {
    super(`Value \`${value}\` is not a valid array.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidArrayError"
    });
  }
};
var InvalidTypeError = class extends BaseError2 {
  constructor(type) {
    super(`Type \`${type}\` is not a valid ABI Type.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidTypeError"
    });
  }
};

// ../node_modules/ox/_esm/core/Rlp.js
function from6(value, options) {
  const { as } = options;
  const encodable = getEncodable2(value);
  const cursor = create(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (as === "Hex")
    return fromBytes(cursor.bytes);
  return cursor.bytes;
}
function fromHex3(hex, options = {}) {
  const { as = "Hex" } = options;
  return from6(hex, { as });
}
function getEncodable2(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList2(bytes.map((x) => getEncodable2(x)));
  return getEncodableBytes2(bytes);
}
function getEncodableList2(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength2(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode5 } of list) {
        encode5(cursor);
      }
    }
  };
}
function getEncodableBytes2(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? fromHex(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength2(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength2(length) {
  if (length <= 255)
    return 1;
  if (length <= 65535)
    return 2;
  if (length <= 16777215)
    return 3;
  if (length <= 4294967295)
    return 4;
  throw new BaseError2("Length is too large.");
}

// ../node_modules/ox/_esm/core/Signature.js
function assert3(signature, options = {}) {
  const { recovered } = options;
  if (typeof signature.r === "undefined")
    throw new MissingPropertiesError({ signature });
  if (typeof signature.s === "undefined")
    throw new MissingPropertiesError({ signature });
  if (recovered && typeof signature.yParity === "undefined")
    throw new MissingPropertiesError({ signature });
  if (signature.r < 0n || signature.r > maxUint256)
    throw new InvalidRError({ value: signature.r });
  if (signature.s < 0n || signature.s > maxUint256)
    throw new InvalidSError({ value: signature.s });
  if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
    throw new InvalidYParityError({ value: signature.yParity });
}
function fromBytes3(signature) {
  return fromHex4(fromBytes(signature));
}
function fromHex4(signature) {
  if (signature.length !== 130 && signature.length !== 132)
    throw new InvalidSerializedSizeError2({ signature });
  const r = BigInt(slice3(signature, 0, 32));
  const s = BigInt(slice3(signature, 32, 64));
  const yParity = (() => {
    const yParity2 = Number(`0x${signature.slice(130)}`);
    if (Number.isNaN(yParity2))
      return void 0;
    try {
      return vToYParity(yParity2);
    } catch {
      throw new InvalidYParityError({ value: yParity2 });
    }
  })();
  if (typeof yParity === "undefined")
    return {
      r,
      s
    };
  return {
    r,
    s,
    yParity
  };
}
function extract2(value) {
  if (typeof value.r === "undefined")
    return void 0;
  if (typeof value.s === "undefined")
    return void 0;
  return from7(value);
}
function from7(signature) {
  const signature_ = (() => {
    if (typeof signature === "string")
      return fromHex4(signature);
    if (signature instanceof Uint8Array)
      return fromBytes3(signature);
    if (typeof signature.r === "string")
      return fromRpc(signature);
    if (signature.v)
      return fromLegacy(signature);
    return {
      r: signature.r,
      s: signature.s,
      ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
    };
  })();
  assert3(signature_);
  return signature_;
}
function fromLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    yParity: vToYParity(signature.v)
  };
}
function fromRpc(signature) {
  const yParity = (() => {
    const v = signature.v ? Number(signature.v) : void 0;
    let yParity2 = signature.yParity ? Number(signature.yParity) : void 0;
    if (typeof v === "number" && typeof yParity2 !== "number")
      yParity2 = vToYParity(v);
    if (typeof yParity2 !== "number")
      throw new InvalidYParityError({ value: signature.yParity });
    return yParity2;
  })();
  return {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    yParity
  };
}
function toTuple(signature) {
  const { r, s, yParity } = signature;
  return [
    yParity ? "0x01" : "0x",
    r === 0n ? "0x" : trimLeft2(fromNumber(r)),
    s === 0n ? "0x" : trimLeft2(fromNumber(s))
  ];
}
function vToYParity(v) {
  if (v === 0 || v === 27)
    return 0;
  if (v === 1 || v === 28)
    return 1;
  if (v >= 35)
    return v % 2 === 0 ? 1 : 0;
  throw new InvalidVError({ value: v });
}
var InvalidSerializedSizeError2 = class extends BaseError2 {
  constructor({ signature }) {
    super(`Value \`${signature}\` is an invalid signature size.`, {
      metaMessages: [
        "Expected: 64 bytes or 65 bytes.",
        `Received ${size3(from2(signature))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSerializedSizeError"
    });
  }
};
var MissingPropertiesError = class extends BaseError2 {
  constructor({ signature }) {
    super(`Signature \`${stringify2(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.MissingPropertiesError"
    });
  }
};
var InvalidRError = class extends BaseError2 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidRError"
    });
  }
};
var InvalidSError = class extends BaseError2 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSError"
    });
  }
};
var InvalidYParityError = class extends BaseError2 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidYParityError"
    });
  }
};
var InvalidVError = class extends BaseError2 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidVError"
    });
  }
};

// ../node_modules/ox/_esm/core/Authorization.js
function from8(authorization, options = {}) {
  if (typeof authorization.chainId === "string")
    return fromRpc2(authorization);
  return { ...authorization, ...options.signature };
}
function fromRpc2(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract2(authorization);
  return {
    address,
    chainId: Number(chainId),
    nonce: BigInt(nonce),
    ...signature
  };
}
function getSignPayload(authorization) {
  return hash(authorization, { presign: true });
}
function hash(authorization, options = {}) {
  const { presign } = options;
  return keccak2562(concat2("0x05", fromHex3(toTuple2(presign ? {
    address: authorization.address,
    chainId: authorization.chainId,
    nonce: authorization.nonce
  } : authorization))));
}
function toTuple2(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract2(authorization);
  return [
    chainId ? fromNumber(chainId) : "0x",
    address,
    nonce ? fromNumber(nonce) : "0x",
    ...signature ? toTuple(signature) : []
  ];
}

// ../node_modules/ox/_esm/core/Secp256k1.js
function recoverAddress2(options) {
  return fromPublicKey(recoverPublicKey2(options));
}
function recoverPublicKey2(options) {
  const { payload, signature } = options;
  const { r, s, yParity } = signature;
  const signature_ = new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
  const point = signature_.recoverPublicKey(from2(payload).substring(2));
  return from3(point);
}
var fromSeedDomain = fromString("ox.secp256k1.fromSeed.v1");

// ../node_modules/ox/_esm/erc8010/SignatureErc8010.js
var magicBytes = "0x8010801080108010801080108010801080108010801080108010801080108010";
var suffixParameters = from5("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
function assert4(value) {
  if (typeof value === "string") {
    if (slice3(value, -32) !== magicBytes)
      throw new InvalidWrappedSignatureError(value);
  } else
    assert3(value.authorization);
}
function from9(value) {
  if (typeof value === "string")
    return unwrap(value);
  return value;
}
function unwrap(wrapped) {
  assert4(wrapped);
  const suffixLength = toNumber2(slice3(wrapped, -64, -32));
  const suffix = slice3(wrapped, -suffixLength - 64, -64);
  const signature = slice3(wrapped, 0, -suffixLength - 64);
  const [auth, to, data] = decode(suffixParameters, suffix);
  const authorization = from8({
    address: auth.delegation,
    chainId: Number(auth.chainId),
    nonce: auth.nonce,
    yParity: auth.yParity,
    r: auth.r,
    s: auth.s
  });
  return {
    authorization,
    signature,
    ...data && data !== "0x" ? { data, to } : {}
  };
}
function wrap(value) {
  const { data, signature } = value;
  assert4(value);
  const self = recoverAddress2({
    payload: getSignPayload(value.authorization),
    signature: from7(value.authorization)
  });
  const suffix = encode3(suffixParameters, [
    {
      ...value.authorization,
      delegation: value.authorization.address,
      chainId: BigInt(value.authorization.chainId)
    },
    value.to ?? self,
    data ?? "0x"
  ]);
  const suffixLength = fromNumber(size3(suffix), { size: 32 });
  return concat2(signature, suffix, suffixLength, magicBytes);
}
function validate4(value) {
  try {
    assert4(value);
    return true;
  } catch {
    return false;
  }
}
var InvalidWrappedSignatureError = class extends BaseError2 {
  constructor(wrapped) {
    super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SignatureErc8010.InvalidWrappedSignatureError"
    });
  }
};

// ../node_modules/viem/_esm/utils/unit/formatUnits.js
function formatUnits(value, decimals) {
  return format(value, decimals);
}

// ../node_modules/viem/_esm/utils/formatters/proof.js
function formatStorageProof(storageProof) {
  return storageProof.map((proof) => ({
    ...proof,
    value: BigInt(proof.value)
  }));
}
function formatProof(proof) {
  return {
    ...proof,
    balance: proof.balance ? BigInt(proof.balance) : void 0,
    nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
    storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
  };
}

// ../node_modules/viem/_esm/actions/public/getProof.js
async function getProof(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical, storageKeys }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const proof = await client.request({
    method: "eth_getProof",
    params: [address, storageKeys, block]
  });
  return formatProof(proof);
}

// ../node_modules/viem/_esm/actions/public/getRawTransaction.js
async function getRawTransaction(client, { hash: hash2 }) {
  const rawTransaction = await client.request({
    method: "eth_getRawTransactionByHash",
    params: [hash2]
  }, { dedupe: true });
  if (!rawTransaction)
    throw new TransactionNotFoundError({ hash: hash2 });
  return rawTransaction;
}

// ../node_modules/viem/_esm/actions/public/getStorageAt.js
async function getStorageAt(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical, slot }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const data = await client.request({
    method: "eth_getStorageAt",
    params: [address, slot, block]
  });
  return data;
}

// ../node_modules/viem/_esm/actions/public/getStorageValues.js
async function getStorageValues(client, { blockHash, blockNumber, blockTag = "latest", requireCanonical, requests }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  return client.request({
    method: "eth_getStorageValues",
    params: [requests, block]
  });
}

// ../node_modules/viem/_esm/actions/public/getTransaction.js
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash2, index: index2, sender, nonce }) {
  const blockTag = blockTag_ || "latest";
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let transaction = null;
  if (hash2) {
    transaction = await client.request({
      method: "eth_getTransactionByHash",
      params: [hash2]
    }, { dedupe: true });
  } else if (blockHash) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockHashAndIndex",
      params: [blockHash, numberToHex(index2)]
    }, { dedupe: true });
  } else if ((blockNumberHex || blockTag) && typeof index2 === "number") {
    transaction = await client.request({
      method: "eth_getTransactionByBlockNumberAndIndex",
      params: [blockNumberHex || blockTag, numberToHex(index2)]
    }, { dedupe: Boolean(blockNumberHex) });
  } else if (sender && typeof nonce === "number") {
    transaction = await client.request({
      method: "eth_getTransactionBySenderAndNonce",
      params: [sender, numberToHex(nonce)]
    }, { dedupe: true });
  }
  if (!transaction)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash: hash2,
      index: index2
    });
  const format2 = client.chain?.formatters?.transaction?.format || formatTransaction;
  return format2(transaction, "getTransaction");
}

// ../node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
async function getTransactionConfirmations(client, { hash: hash2, transactionReceipt }) {
  const [blockNumber, transaction] = await Promise.all([
    getAction(client, getBlockNumber, "getBlockNumber")({}),
    hash2 ? getAction(client, getTransaction, "getTransaction")({ hash: hash2 }) : void 0
  ]);
  const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
  if (!transactionBlockNumber)
    return 0n;
  return blockNumber - transactionBlockNumber + 1n;
}

// ../node_modules/viem/_esm/actions/public/getTransactionReceipt.js
async function getTransactionReceipt(client, { hash: hash2 }) {
  const receipt = await client.request({
    method: "eth_getTransactionReceipt",
    params: [hash2]
  }, { dedupe: true });
  if (!receipt)
    throw new TransactionReceiptNotFoundError({ hash: hash2 });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return format2(receipt, "getTransactionReceipt");
}

// ../node_modules/viem/_esm/actions/public/multicall.js
async function multicall(client, parameters) {
  const { account, authorizationList, allowFailure = true, blockHash, blockNumber, blockOverrides, blockTag, requireCanonical, stateOverride } = parameters;
  const contracts = parameters.contracts;
  const batch = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const batchSize = parameters.batchSize ?? batch.batchSize ?? 1024;
  const deployless = parameters.deployless ?? batch.deployless ?? false;
  const multicallAddress = (() => {
    if (parameters.multicallAddress)
      return parameters.multicallAddress;
    if (deployless)
      return null;
    if (client.chain) {
      return getChainContractAddress({
        blockNumber,
        chain: client.chain,
        contract: "multicall3"
      });
    }
    throw new Error("client chain not configured. multicallAddress is required.");
  })();
  const chunkedCalls = [[]];
  let currentChunk = 0;
  let currentChunkSize = 0;
  for (let i = 0; i < contracts.length; i++) {
    const { abi: abi2, address, args, functionName } = contracts[i];
    try {
      const callData = encodeFunctionData({ abi: abi2, args, functionName });
      currentChunkSize += (callData.length - 2) / 2;
      if (
        // Check if batching is enabled.
        batchSize > 0 && // Check if the current size of the batch exceeds the size limit.
        currentChunkSize > batchSize && // Check if the current chunk is not already empty.
        chunkedCalls[currentChunk].length > 0
      ) {
        currentChunk++;
        currentChunkSize = (callData.length - 2) / 2;
        chunkedCalls[currentChunk] = [];
      }
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData,
          target: address
        }
      ];
    } catch (err) {
      const error = getContractError(err, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/multicall",
        functionName,
        sender: account
      });
      if (!allowFailure)
        throw error;
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData: "0x",
          target: address
        }
      ];
    }
  }
  const batching = Boolean(client.batch?.multicall);
  const batches = batching ? chunkedCalls.flatMap((calls) => calls.map((call2) => [call2])) : chunkedCalls;
  const aggregate3Results = await Promise.allSettled(batches.map((calls) => {
    if (batching)
      return scheduleMulticall(client, {
        account,
        authorizationList,
        batchSize,
        blockHash,
        blockNumber,
        blockOverrides,
        blockTag,
        call: calls[0],
        multicallAddress,
        requireCanonical,
        stateOverride
      }).then((result) => [result]);
    return getAction(client, readContract, "readContract")({
      ...multicallAddress === null ? { code: multicall3Bytecode } : { address: multicallAddress },
      abi: multicall3Abi,
      account,
      args: [calls],
      authorizationList,
      blockHash,
      blockNumber,
      blockOverrides,
      blockTag,
      functionName: "aggregate3",
      requireCanonical,
      stateOverride
    });
  }));
  const results = [];
  for (let i = 0; i < aggregate3Results.length; i++) {
    const result = aggregate3Results[i];
    if (result.status === "rejected") {
      if (!allowFailure)
        throw result.reason;
      for (let j = 0; j < batches[i].length; j++) {
        results.push({
          status: "failure",
          error: result.reason,
          result: void 0
        });
      }
      continue;
    }
    const aggregate3Result = result.value;
    for (let j = 0; j < aggregate3Result.length; j++) {
      const { returnData, success } = aggregate3Result[j];
      const { callData } = batches[i][j];
      const { abi: abi2, address, functionName, args } = contracts[results.length];
      try {
        if (callData === "0x")
          throw new AbiDecodingZeroDataError();
        if (!success)
          throw new RawContractError({ data: returnData });
        const result2 = decodeFunctionResult({
          abi: abi2,
          args,
          data: returnData,
          functionName
        });
        results.push(allowFailure ? { result: result2, status: "success" } : result2);
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/multicall",
          functionName
        });
        if (!allowFailure)
          throw error;
        results.push({ error, result: void 0, status: "failure" });
      }
    }
  }
  if (results.length !== contracts.length)
    throw new BaseError("multicall results mismatch");
  return results;
}
async function scheduleMulticall(client, parameters) {
  const { batchSize, call: call2, multicallAddress, ...rest } = parameters;
  const { wait: wait2 = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { schedule } = createBatchScheduler({
    id: stringify(["multicall", client.uid, batchSize, multicallAddress, rest]),
    wait: wait2,
    shouldSplitBatch(calls) {
      if (batchSize === 0)
        return false;
      const size5 = calls.reduce((size6, { callData }) => size6 + (callData.length - 2) / 2, 0);
      return size5 > batchSize;
    },
    fn: (calls) => getAction(client, readContract, "readContract")({
      ...multicallAddress === null ? { code: multicall3Bytecode } : { address: multicallAddress },
      ...rest,
      abi: multicall3Abi,
      args: [calls],
      functionName: "aggregate3"
    })
  });
  const [result] = await schedule(call2);
  return result;
}

// ../node_modules/viem/_esm/actions/public/simulateBlocks.js
async function simulateBlocks(client, parameters) {
  const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
  try {
    const blockStateCalls = [];
    for (const block2 of blocks) {
      const blockOverrides = block2.blockOverrides ? toRpc(block2.blockOverrides) : void 0;
      const calls = block2.calls.map((call_) => {
        const call2 = call_;
        const account = call2.account ? parseAccount(call2.account) : void 0;
        const data = call2.abi ? encodeFunctionData(call2) : call2.data;
        const request = {
          ...call2,
          account,
          data: call2.dataSuffix ? concat([data || "0x", call2.dataSuffix]) : data,
          from: call2.from ?? account?.address
        };
        assertRequest(request);
        return formatTransactionRequest(request);
      });
      const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : void 0;
      blockStateCalls.push({
        blockOverrides,
        calls,
        stateOverrides
      });
    }
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const result = await client.request({
      method: "eth_simulateV1",
      params: [
        { blockStateCalls, returnFullTransactions, traceTransfers, validation },
        block
      ]
    });
    return result.map((block2, i) => ({
      ...formatBlock(block2),
      calls: block2.calls.map((call2, j) => {
        const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
        const data = call2.error?.data ?? call2.returnData;
        const gasUsed = BigInt(call2.gasUsed);
        const maxUsedGas = call2.maxUsedGas === void 0 ? void 0 : BigInt(call2.maxUsedGas);
        const logs = call2.logs?.map((log) => formatLog(log));
        const status = call2.status === "0x1" ? "success" : "failure";
        const result2 = abi2 && status === "success" && data !== "0x" ? decodeFunctionResult({
          abi: abi2,
          data,
          functionName
        }) : null;
        const error = (() => {
          if (status === "success")
            return void 0;
          let error2;
          if (data === "0x")
            error2 = new AbiDecodingZeroDataError();
          else if (data)
            error2 = new RawContractError({ data });
          if (!error2)
            return void 0;
          return getContractError(error2, {
            abi: abi2 ?? [],
            address: to ?? "0x",
            args,
            functionName: functionName ?? "<unknown>"
          });
        })();
        return {
          data,
          gasUsed,
          logs,
          // only present when reported by the node, so existing consumers
          // (and snapshots) are unaffected on nodes that omit it.
          ...maxUsedGas === void 0 ? {} : { maxUsedGas },
          status,
          ...status === "success" ? {
            result: result2
          } : {
            error
          }
        };
      })
    }));
  } catch (e) {
    const cause = e;
    const error = getNodeError(cause, {});
    if (error instanceof UnknownNodeError)
      throw cause;
    throw error;
  }
}

// ../node_modules/ox/_esm/core/internal/abiItem.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", "error", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError2("Unable to normalize signature.");
  return result;
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return validate3(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return isArgOfType(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return validate3(args[parameterIndex], {
          strict: false
        });
      if (types.includes("address") && types.includes("bytes"))
        return validate3(args[parameterIndex], {
          strict: false
        });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}

// ../node_modules/ox/_esm/core/AbiItem.js
function from10(abiItem, options = {}) {
  const { prepare = true } = options;
  const item = (() => {
    if (Array.isArray(abiItem))
      return parseAbiItem(abiItem);
    if (typeof abiItem === "string")
      return parseAbiItem(abiItem);
    return abiItem;
  })();
  return {
    ...item,
    ...prepare ? { hash: getSignatureHash(item) } : {}
  };
}
function fromAbi(abi2, name, options) {
  const { args = [], prepare = true } = options ?? {};
  const isSelector = validate2(name, { strict: false });
  const abiItems = abi2.filter((abiItem2) => {
    if (isSelector) {
      if (abiItem2.type === "function" || abiItem2.type === "error")
        return getSelector(abiItem2) === slice3(name, 0, 4);
      if (abiItem2.type === "event")
        return getSignatureHash(abiItem2) === name;
      return false;
    }
    return "name" in abiItem2 && abiItem2.name === name;
  });
  if (abiItems.length === 0)
    throw new NotFoundError({ name });
  if (abiItems.length === 1)
    return {
      ...abiItems[0],
      ...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
    };
  let matchedAbiItem;
  for (const abiItem2 of abiItems) {
    if (!("inputs" in abiItem2))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem2.inputs || abiItem2.inputs.length === 0)
        return {
          ...abiItem2,
          ...prepare ? { hash: getSignatureHash(abiItem2) } : {}
        };
      continue;
    }
    if (!abiItem2.inputs)
      continue;
    if (abiItem2.inputs.length === 0)
      continue;
    if (abiItem2.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem2 && abiItem2.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem2.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AmbiguityError({
            abiItem: abiItem2,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem2;
    }
  }
  const abiItem = (() => {
    if (matchedAbiItem)
      return matchedAbiItem;
    const [abiItem2, ...overloads] = abiItems;
    return { ...abiItem2, overloads };
  })();
  if (!abiItem)
    throw new NotFoundError({ name });
  return {
    ...abiItem,
    ...prepare ? { hash: getSignatureHash(abiItem) } : {}
  };
}
function getSelector(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  return slice3(getSignatureHash(abiItem), 0, 4);
}
function getSignature(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  const signature = (() => {
    if (typeof abiItem === "string")
      return abiItem;
    return formatAbiItem(abiItem);
  })();
  return normalizeSignature(signature);
}
function getSignatureHash(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash)
    return abiItem.hash;
  return keccak2562(fromString2(getSignature(abiItem)));
}
var AmbiguityError = class extends BaseError2 {
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI Items.", {
      metaMessages: [
        // TODO: abitype to add support for signature-formatted ABI items.
        `\`${x.type}\` in \`${normalizeSignature(formatAbiItem(x.abiItem))}\`, and`,
        `\`${y.type}\` in \`${normalizeSignature(formatAbiItem(y.abiItem))}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.AmbiguityError"
    });
  }
};
var NotFoundError = class extends BaseError2 {
  constructor({ name, data, type = "item" }) {
    const selector = (() => {
      if (name)
        return ` with name "${name}"`;
      if (data)
        return ` with data "${data}"`;
      return "";
    })();
    super(`ABI ${type}${selector} not found.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.NotFoundError"
    });
  }
};

// ../node_modules/ox/_esm/core/AbiConstructor.js
function encode4(...parameters) {
  const [abiConstructor, options] = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, options2] = parameters;
      return [fromAbi2(abi2), options2];
    }
    return parameters;
  })();
  const { bytecode, args } = options;
  return concat2(bytecode, abiConstructor.inputs?.length && args?.length ? encode3(abiConstructor.inputs, args) : "0x");
}
function from11(abiConstructor) {
  return from10(abiConstructor);
}
function fromAbi2(abi2) {
  const item = abi2.find((item2) => item2.type === "constructor");
  if (!item)
    throw new NotFoundError({ name: "constructor" });
  return item;
}

// ../node_modules/ox/_esm/core/AbiEvent.js
function from12(abiEvent, options = {}) {
  return from10(abiEvent, options);
}
function getSelector2(abiItem) {
  return getSignatureHash(abiItem);
}

// ../node_modules/ox/_esm/core/AbiFunction.js
function decodeResult(...parameters) {
  const [abiFunction, data, options = {}] = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name, data2, options2] = parameters;
      return [fromAbi3(abi2, name), data2, options2];
    }
    return parameters;
  })();
  const values = decode(abiFunction.outputs, data, options);
  if (values && Object.keys(values).length === 0)
    return void 0;
  if (values && Object.keys(values).length === 1) {
    if (Array.isArray(values))
      return values[0];
    return Object.values(values)[0];
  }
  return values;
}
function encodeData2(...parameters) {
  const [abiFunction, args = []] = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name, args3] = parameters;
      return [fromAbi3(abi2, name, { args: args3 }), args3];
    }
    const [abiFunction2, args2] = parameters;
    return [abiFunction2, args2];
  })();
  const { overloads } = abiFunction;
  const item = overloads ? fromAbi3([abiFunction, ...overloads], abiFunction.name, {
    args
  }) : abiFunction;
  const selector = getSelector3(item);
  const data = args.length > 0 ? encode3(item.inputs, args) : void 0;
  return data ? concat2(selector, data) : selector;
}
function from13(abiFunction, options = {}) {
  return from10(abiFunction, options);
}
function fromAbi3(abi2, name, options) {
  const item = fromAbi(abi2, name, options);
  if (item.type !== "function")
    throw new NotFoundError({ name, type: "function" });
  return item;
}
function getSelector3(abiItem) {
  return getSelector(abiItem);
}

// ../node_modules/viem/_esm/constants/address.js
var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var zeroAddress = "0x0000000000000000000000000000000000000000";

// ../node_modules/viem/_esm/actions/public/simulateCalls.js
var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
var staticCallCode = "0x608060405234801561000f575f5ffd5b5060043610610029575f3560e01c8063fd00430c1461002d575b5f5ffd5b6100476004803603810190610042919061012b565b610049565b005b80825f375f5f825f865afa610060573d5f5f3e3d5ffd5b3d5f5f3e3d5ff35b5f5ffd5b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61009982610070565b9050919050565b6100a98161008f565b81146100b3575f5ffd5b50565b5f813590506100c4816100a0565b92915050565b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83601f8401126100eb576100ea6100ca565b5b8235905067ffffffffffffffff811115610108576101076100ce565b5b602083019150836001820283011115610124576101236100d2565b5b9250929050565b5f5f5f6040848603121561014257610141610068565b5b5f61014f868287016100b6565b935050602084013567ffffffffffffffff8111156101705761016f61006c565b5b61017c868287016100d6565b9250925050925092509256fea2646970667358221220635ed99185cacf3f2acba6921f23687c969cec2bbaf5f9ad599f507e6e105e6964736f6c63430008230033";
var assetProbeGas = 1000000n;
var staticCallAddressBase = 0x00000000000000000000000000000000deadbeefn;
var transferEventSelector = getSelector2(from12("event Transfer(address indexed from, address indexed to, uint256 value)"));
var balanceOfFunction = from13("function balanceOf(address) returns (uint256)");
var decimalsFunction = from13("function decimals() returns (uint256)");
var tokenUriFunction = from13("function tokenURI(uint256) returns (string)");
var symbolFunction = from13("function symbol() returns (string)");
var staticCallFunction = from13("function query(address target, bytes data)");
async function simulateCalls(client, parameters) {
  const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation } = parameters;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  if (traceAssetChanges && !account)
    throw new BaseError("`account` is required when `traceAssetChanges` is true");
  const getBalanceData = account ? encode4(from11("constructor(bytes, bytes)"), {
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [
      getBalanceCode,
      encodeData2(from13("function getBalance(address)"), [account.address])
    ]
  }) : void 0;
  const blockTag_ = blockTag ?? client.experimental_blockTag ?? "latest";
  let baseBlockNumber = blockNumber;
  if (traceAssetChanges && typeof baseBlockNumber !== "bigint" && blockTag_ !== "earliest" && blockTag_ !== "pending") {
    if (blockTag_ === "latest")
      baseBlockNumber = await getBlockNumber(client, { cacheTime: 0 });
    else {
      const block2 = await getBlock(client, { blockTag: blockTag_ });
      if (typeof block2.number !== "bigint")
        throw new BaseError(`Block tag \`${blockTag_}\` did not resolve to a number.`);
      baseBlockNumber = block2.number;
    }
  }
  const block_ = typeof baseBlockNumber === "bigint" ? { blockNumber: baseBlockNumber } : { blockTag: blockTag_ };
  const discovery = traceAssetChanges ? await simulateBlocks(client, {
    ...block_,
    blocks: [
      {
        calls: calls.map((call2) => ({
          ...call2,
          from: account.address
        })),
        stateOverrides
      }
    ],
    traceTransfers,
    validation
  }) : void 0;
  const assetAddresses = discovery ? [
    .../* @__PURE__ */ new Set([
      ...tokensFromLogs(discovery[0].calls.flatMap((call2) => call2.logs ?? []), account.address),
      // Included even for calls without data: contracts that mint on receiving
      // native value (WETH) emit `Deposit`, not a `Transfer` the logs would catch.
      // Candidates without code fall out at `isBalance`.
      ...parameters.calls.map((call2) => call2.to?.toLowerCase())
    ])
  ].filter((address) => Boolean(address) && address !== ethAddress && address !== zeroAddress) : [];
  const staticCallAddress = getStaticCallAddress([
    ...account ? [account.address] : [],
    ...assetAddresses,
    ...stateOverrides?.map(({ address }) => address) ?? []
  ]);
  const staticCallStateOverrides = [
    { address: staticCallAddress, code: staticCallCode }
  ];
  const [balanceCallsPre, blocks] = await Promise.all([
    traceAssetChanges ? Promise.all([
      readBalance(client, {
        account: account.address,
        ...block_,
        data: getBalanceData,
        stateOverride: stateOverrides
      }),
      ...assetAddresses.map((address) => readBalance(client, {
        account: account.address,
        address,
        ...block_,
        data: encodeData2(balanceOfFunction, [
          account.address
        ]),
        staticCallAddress,
        stateOverride: stateOverrides
      }))
    ]) : [],
    simulateBlocks(client, {
      ...block_,
      blocks: [
        {
          calls: [...calls, { to: zeroAddress }].map((call2) => ({
            ...call2,
            from: account?.address
          })),
          stateOverrides
        },
        ...traceAssetChanges ? [
          // ETH post balances
          {
            calls: [{ data: getBalanceData }]
          },
          // Asset post balances
          {
            calls: assetAddresses.map((address) => ({
              to: staticCallAddress,
              gas: assetProbeGas,
              data: encodeStaticCall(address, encodeData2(balanceOfFunction, [
                account.address
              ]))
            })),
            stateOverrides: staticCallStateOverrides
          },
          // Decimals
          {
            calls: assetAddresses.map((address) => ({
              to: staticCallAddress,
              gas: assetProbeGas,
              data: encodeStaticCall(address, encodeData2(decimalsFunction))
            })),
            stateOverrides: staticCallStateOverrides
          },
          // Token URI
          {
            calls: assetAddresses.map((address) => ({
              to: staticCallAddress,
              gas: assetProbeGas,
              data: encodeStaticCall(address, encodeData2(tokenUriFunction, [0n]))
            })),
            stateOverrides: staticCallStateOverrides
          },
          // Symbols
          {
            calls: assetAddresses.map((address) => ({
              to: staticCallAddress,
              gas: assetProbeGas,
              data: encodeStaticCall(address, encodeData2(symbolFunction))
            })),
            stateOverrides: staticCallStateOverrides
          }
        ] : []
      ],
      traceTransfers,
      validation
    })
  ]);
  const block_results = blocks[0];
  const [block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols] = traceAssetChanges ? blocks.slice(1) : [];
  const { calls: block_calls, ...block } = block_results;
  const results = block_calls.slice(0, -1);
  const balancesPre = balanceCallsPre.map((call2) => isBalance(call2) ? hexToBigInt(call2.data) : null);
  const ethPost = block_ethPost?.calls ?? [];
  const assetsPost = block_assetsPost?.calls ?? [];
  const balanceCallsPost = [...ethPost, ...assetsPost];
  const balancesPost = balanceCallsPost.map((call2) => isBalance(call2) ? hexToBigInt(call2.data) : null);
  const decimals = (block_decimals?.calls ?? []).map((call2) => decodeAssetResult(call2, decimalsFunction));
  const symbols = (block_symbols?.calls ?? []).map((call2) => decodeAssetResult(call2, symbolFunction));
  const tokenURI = (block_tokenURI?.calls ?? []).map((call2) => decodeAssetResult(call2, tokenUriFunction));
  const changes = [];
  for (const [i, balancePost] of balancesPost.entries()) {
    const balancePre_ = balancesPre[i];
    const preCall = balanceCallsPre[i];
    const balancePre = typeof balancePre_ === "bigint" ? balancePre_ : i > 0 && preCall?.status === "success" && preCall.data === "0x" ? 0n : null;
    if (typeof balancePost !== "bigint")
      continue;
    if (typeof balancePre !== "bigint")
      continue;
    const decimals_ = decimals[i - 1];
    const symbol_ = symbols[i - 1];
    const tokenURI_ = tokenURI[i - 1];
    const token = (() => {
      if (i === 0)
        return {
          address: ethAddress,
          decimals: 18,
          symbol: "ETH"
        };
      return {
        address: assetAddresses[i - 1],
        decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : void 0,
        symbol: symbol_ ?? void 0
      };
    })();
    changes.push({
      token,
      value: {
        pre: balancePre,
        post: balancePost,
        diff: balancePost - balancePre
      }
    });
  }
  return {
    assetChanges: changes,
    block,
    results
  };
}
function encodeStaticCall(address, data) {
  return encodeData2(staticCallFunction, [address, data]);
}
function tokensFromLogs(logs, account) {
  const account_ = pad(account.toLowerCase(), { size: 32 });
  return logs.filter((log) => {
    if (log.topics[0]?.toLowerCase() !== transferEventSelector)
      return false;
    if (log.address.toLowerCase() === ethAddress)
      return false;
    return log.topics[1]?.toLowerCase() === account_ || log.topics[2]?.toLowerCase() === account_;
  }).map((log) => log.address.toLowerCase());
}
function isBalance(call2) {
  return call2.status === "success" && /^0x[\da-f]{64}$/i.test(call2.data);
}
function decodeAssetResult(call2, abiFunction) {
  if (call2.status === "failure" || call2.data === "0x")
    return null;
  try {
    return decodeResult(abiFunction, call2.data);
  } catch {
    return null;
  }
}
async function readBalance(client, parameters) {
  const { account, address, blockNumber, blockTag, data, staticCallAddress, stateOverride } = parameters;
  try {
    const result = await call({ ...client, ccipRead: false }, {
      account: address ? zeroAddress : account,
      data: address ? encodeStaticCall(address, data) : data,
      stateOverride: address && staticCallAddress ? [
        ...stateOverride ?? [],
        { address: staticCallAddress, code: staticCallCode }
      ] : stateOverride,
      ...address ? { gas: assetProbeGas, to: staticCallAddress } : {},
      ...typeof blockNumber === "bigint" ? { blockNumber } : { blockTag }
    });
    return { data: result.data ?? "0x", status: "success" };
  } catch (error) {
    if (!(error instanceof CallExecutionError) || !(error.cause instanceof ExecutionRevertedError))
      throw error;
    return { data: "0x", status: "failure" };
  }
}
function getStaticCallAddress(addresses) {
  const occupied = new Set(addresses.map((address) => address.toLowerCase()));
  let value = staticCallAddressBase;
  while (occupied.has(`0x${value.toString(16).padStart(40, "0")}`))
    value++;
  return `0x${value.toString(16).padStart(40, "0")}`;
}

// ../node_modules/ox/_esm/erc6492/SignatureErc6492.js
var SignatureErc6492_exports = {};
__export(SignatureErc6492_exports, {
  InvalidWrappedSignatureError: () => InvalidWrappedSignatureError2,
  assert: () => assert5,
  from: () => from14,
  magicBytes: () => magicBytes2,
  universalSignatureValidatorAbi: () => universalSignatureValidatorAbi,
  universalSignatureValidatorBytecode: () => universalSignatureValidatorBytecode,
  unwrap: () => unwrap2,
  validate: () => validate5,
  wrap: () => wrap2
});
var magicBytes2 = "0x6492649264926492649264926492649264926492649264926492649264926492";
var universalSignatureValidatorBytecode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
var universalSignatureValidatorAbi = [
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    outputs: [
      {
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "isValidSig"
  }
];
function assert5(wrapped) {
  if (slice3(wrapped, -32) !== magicBytes2)
    throw new InvalidWrappedSignatureError2(wrapped);
}
function from14(wrapped) {
  if (typeof wrapped === "string")
    return unwrap2(wrapped);
  return wrapped;
}
function unwrap2(wrapped) {
  assert5(wrapped);
  const [to, data, signature] = decode(from5("address, bytes, bytes"), wrapped);
  return { data, signature, to };
}
function wrap2(value) {
  const { data, signature, to } = value;
  return concat2(encode3(from5("address, bytes, bytes"), [
    to,
    data,
    signature
  ]), magicBytes2);
}
function validate5(wrapped) {
  try {
    assert5(wrapped);
    return true;
  } catch {
    return false;
  }
}
var InvalidWrappedSignatureError2 = class extends BaseError2 {
  constructor(wrapped) {
    super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SignatureErc6492.InvalidWrappedSignatureError"
    });
  }
};

// ../node_modules/viem/_esm/utils/signature/serializeSignature.js
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes(signature);
}

// ../node_modules/viem/_esm/actions/public/verifyHash.js
async function verifyHash(client, parameters) {
  const { address, chain = client.chain, hash: hash2, erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ?? chain?.contracts?.erc6492Verifier?.address, multicallAddress = parameters.multicallAddress ?? chain?.contracts?.multicall3?.address, mode = "auto" } = parameters;
  if (chain?.verifyHash)
    return await chain.verifyHash(client, parameters);
  const signature = (() => {
    const signature2 = parameters.signature;
    if (isHex(signature2))
      return signature2;
    if (typeof signature2 === "object" && "r" in signature2 && "s" in signature2)
      return serializeSignature(signature2);
    return bytesToHex(signature2);
  })();
  try {
    if (mode === "eoa") {
      try {
        const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash2, signature }));
        if (verified)
          return true;
      } catch {
      }
    }
    if (SignatureErc8010_exports.validate(signature))
      return await verifyErc8010(client, {
        ...parameters,
        multicallAddress,
        signature
      });
    return await verifyErc6492(client, {
      ...parameters,
      verifierAddress,
      signature
    });
  } catch (error) {
    if (mode !== "eoa") {
      try {
        const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash2, signature }));
        if (verified)
          return true;
      } catch {
      }
    }
    if (error instanceof VerificationError) {
      return false;
    }
    throw error;
  }
}
async function verifyErc8010(client, parameters) {
  const { address, blockHash, blockNumber, blockTag, hash: hash2, multicallAddress, requireCanonical } = parameters;
  const { authorization: authorization_ox, data: initData, signature, to } = SignatureErc8010_exports.unwrap(parameters.signature);
  const code = await getCode(client, {
    address,
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  if (code === concatHex(["0xef0100", authorization_ox.address]))
    return await verifyErc1271(client, {
      ...parameters,
      signature
    });
  const authorization = {
    address: authorization_ox.address,
    chainId: Number(authorization_ox.chainId),
    nonce: Number(authorization_ox.nonce),
    r: numberToHex(authorization_ox.r, { size: 32 }),
    s: numberToHex(authorization_ox.s, { size: 32 }),
    yParity: authorization_ox.yParity
  };
  const valid = await verifyAuthorization({
    address,
    authorization
  });
  if (!valid)
    throw new VerificationError();
  const results = await getAction(client, readContract, "readContract")({
    ...multicallAddress ? { address: multicallAddress } : { code: multicall3Bytecode },
    authorizationList: [authorization],
    abi: multicall3Abi,
    blockHash,
    blockNumber,
    blockTag: "pending",
    functionName: "aggregate3",
    requireCanonical,
    args: [
      [
        ...initData ? [
          {
            allowFailure: true,
            target: to ?? address,
            callData: initData
          }
        ] : [],
        {
          allowFailure: true,
          target: address,
          callData: encodeFunctionData({
            abi: erc1271Abi,
            functionName: "isValidSignature",
            args: [hash2, signature]
          })
        }
      ]
    ]
  });
  const data = results[results.length - 1]?.returnData;
  if (data?.startsWith("0x1626ba7e"))
    return true;
  throw new VerificationError();
}
async function verifyErc6492(client, parameters) {
  const { address, factory, factoryData, hash: hash2, signature, verifierAddress, ...rest } = parameters;
  const wrappedSignature = await (async () => {
    if (!factory && !factoryData)
      return signature;
    if (SignatureErc6492_exports.validate(signature))
      return signature;
    return SignatureErc6492_exports.wrap({
      data: factoryData,
      signature,
      to: factory
    });
  })();
  const args = verifierAddress ? {
    to: verifierAddress,
    data: encodeFunctionData({
      abi: erc6492SignatureValidatorAbi,
      functionName: "isValidSig",
      args: [address, hash2, wrappedSignature]
    }),
    ...rest
  } : {
    data: encodeDeployData({
      abi: erc6492SignatureValidatorAbi,
      args: [address, hash2, wrappedSignature],
      bytecode: erc6492SignatureValidatorByteCode
    }),
    ...rest
  };
  const { data } = await getAction(client, call, "call")(args).catch((error) => {
    if (error instanceof CallExecutionError)
      throw new VerificationError();
    throw error;
  });
  if (hexToBool(data ?? "0x0"))
    return true;
  throw new VerificationError();
}
async function verifyErc1271(client, parameters) {
  const { address, blockHash, blockNumber, blockTag, hash: hash2, requireCanonical, signature } = parameters;
  const result = await getAction(client, readContract, "readContract")({
    address,
    abi: erc1271Abi,
    args: [hash2, signature],
    blockHash,
    blockNumber,
    blockTag,
    functionName: "isValidSignature",
    requireCanonical
  }).catch((error) => {
    if (error instanceof ContractFunctionExecutionError)
      throw new VerificationError();
    throw error;
  });
  if (result.startsWith("0x1626ba7e"))
    return true;
  throw new VerificationError();
}
var VerificationError = class extends Error {
};

// ../node_modules/viem/_esm/actions/public/verifyMessage.js
async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
  const hash2 = hashMessage(message);
  return getAction(client, verifyHash, "verifyHash")({
    address,
    factory,
    factoryData,
    hash: hash2,
    signature,
    ...callRequest
  });
}

// ../node_modules/viem/_esm/actions/public/verifyTypedData.js
async function verifyTypedData(client, parameters) {
  const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
  const hash2 = hashTypedData({ message, primaryType, types, domain });
  return getAction(client, verifyHash, "verifyHash")({
    address,
    factory,
    factoryData,
    hash: hash2,
    signature,
    ...callRequest
  });
}

// ../node_modules/viem/_esm/actions/public/watchBlockNumber.js
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  let prevBlockNumber;
  const pollBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
      try {
        const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
        if (prevBlockNumber !== void 0) {
          if (blockNumber === prevBlockNumber)
            return;
          if (blockNumber - prevBlockNumber > 1 && emitMissed) {
            for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
              emit.onBlockNumber(i, prevBlockNumber);
              prevBlockNumber = i;
            }
          }
        }
        if (prevBlockNumber === void 0 || blockNumber > prevBlockNumber) {
          emit.onBlockNumber(blockNumber, prevBlockNumber);
          prevBlockNumber = blockNumber;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["newHeads"],
            onData(data) {
              if (!active)
                return;
              const blockNumber = hexToBigInt(data.result?.number);
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}

// ../node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
async function waitForTransactionReceipt(client, parameters) {
  const {
    checkReplacement = client.chain?.supportsTransactionReplacementDetection ?? true,
    confirmations = 1,
    hash: hash2,
    onReplaced,
    retryCount = 6,
    retryDelay = ({ count }) => ~~(1 << count) * 200,
    // exponential backoff
    timeout = 18e4
  } = parameters;
  const pollingInterval = (() => {
    if (parameters.pollingInterval)
      return parameters.pollingInterval;
    if (client.chain?.experimental_preconfirmationTime)
      return client.chain.experimental_preconfirmationTime;
    return client.pollingInterval;
  })();
  const observerId = stringify([
    "waitForTransactionReceipt",
    client.uid,
    hash2,
    // Concurrent calls with different behavior-defining options must not
    // share an observer: the first call's polling closure decides timeout,
    // confirmations, polling interval and replacement checks for everyone.
    {
      checkReplacement,
      confirmations,
      pollingInterval,
      retryCount,
      timeout
    }
  ]);
  let transaction;
  let replacedTransaction;
  let receipt;
  let retrying = false;
  let _unobserve;
  let _unwatch;
  const { promise, resolve: resolve2, reject } = withResolvers();
  const timer = timeout ? setTimeout(() => {
    _unwatch?.();
    _unobserve?.();
    reject(new WaitForTransactionReceiptTimeoutError({ hash: hash2 }));
  }, timeout) : void 0;
  _unobserve = observe(observerId, { onReplaced, resolve: resolve2, reject }, async (emit) => {
    receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash2 }).catch(() => void 0);
    if (receipt && confirmations <= 1) {
      clearTimeout(timer);
      emit.resolve(receipt);
      _unobserve?.();
      return;
    }
    _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
      emitMissed: true,
      emitOnBegin: true,
      poll: true,
      pollingInterval,
      async onBlockNumber(blockNumber_) {
        const done = (fn) => {
          clearTimeout(timer);
          _unwatch?.();
          fn();
          _unobserve?.();
        };
        let blockNumber = blockNumber_;
        if (retrying)
          return;
        try {
          if (receipt) {
            if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
              return;
            done(() => emit.resolve(receipt));
            return;
          }
          if (checkReplacement && !transaction) {
            retrying = true;
            await withRetry(async () => {
              transaction = await getAction(client, getTransaction, "getTransaction")({ hash: hash2 });
              if (transaction.blockNumber)
                blockNumber = transaction.blockNumber;
            }, {
              delay: retryDelay,
              retryCount
            });
            retrying = false;
          }
          receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash2 });
          if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
            return;
          done(() => emit.resolve(receipt));
        } catch (err) {
          if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
            if (!transaction) {
              retrying = false;
              return;
            }
            try {
              replacedTransaction = transaction;
              retrying = true;
              const block = await withRetry(() => getAction(client, getBlock, "getBlock")({
                blockNumber,
                includeTransactions: true
              }), {
                delay: retryDelay,
                retryCount,
                shouldRetry: ({ error }) => error instanceof BlockNotFoundError
              });
              retrying = false;
              const replacementTransaction = block.transactions.find(({ from: from15, hash: hash3, nonce }) => isAddressEqual(from15, replacedTransaction.from) && hash3 !== replacedTransaction.hash && nonce === replacedTransaction.nonce);
              if (!replacementTransaction)
                return;
              receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
                hash: replacementTransaction.hash
              });
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              let reason = "replaced";
              if ((replacementTransaction.to && replacedTransaction.to ? isAddressEqual(replacementTransaction.to, replacedTransaction.to) : replacementTransaction.to === replacedTransaction.to) && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                reason = "repriced";
              } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                reason = "cancelled";
              }
              done(() => {
                emit.onReplaced?.({
                  reason,
                  replacedTransaction,
                  transaction: replacementTransaction,
                  transactionReceipt: receipt
                });
                emit.resolve(receipt);
              });
            } catch (err_) {
              done(() => emit.reject(err_));
            }
          } else {
            done(() => emit.reject(err));
          }
        }
      }
    });
  });
  return promise;
}

// ../node_modules/viem/_esm/actions/public/watchBlockHeaders.js
var blockFields = [
  "size",
  "totalDifficulty",
  "transactions",
  "uncles",
  "withdrawals"
];
function watchBlockHeaders(client, { onBlockHeader, onError }) {
  let prevBlockHeader;
  const observerId = stringify(["watchBlockHeaders", client.uid]);
  return observe(observerId, { onBlockHeader, onError }, (emit) => {
    let active = true;
    let subscribed = false;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["newHeads"],
          onData(data) {
            if (!active)
              return;
            const blockHeader = (client.chain?.formatters?.block?.format || formatBlock)(data.result, "watchBlockHeaders");
            for (const field of blockFields)
              delete blockHeader[field];
            emit.onBlockHeader(blockHeader, prevBlockHeader);
            prevBlockHeader = blockHeader;
          },
          onError(error) {
            if (subscribed)
              emit.onError?.(error);
          }
        });
        subscribed = true;
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        emit.onError?.(err);
      }
    })();
    return () => unsubscribe();
  });
}

// ../node_modules/viem/_esm/actions/public/watchBlocks.js
function watchBlocks(client, { blockTag = client.experimental_blockTag ?? "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const includeTransactions = includeTransactions_ ?? false;
  let prevBlock;
  const pollBlocks = () => {
    const observerId = stringify([
      "watchBlocks",
      client.uid,
      blockTag,
      emitMissed,
      emitOnBegin,
      includeTransactions,
      pollingInterval
    ]);
    return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
      try {
        const block = await getAction(client, getBlock, "getBlock")({
          blockTag,
          includeTransactions
        });
        if (block.number !== null && prevBlock?.number != null) {
          if (block.number === prevBlock.number)
            return;
          if (block.number - prevBlock.number > 1 && emitMissed) {
            for (let i = prevBlock?.number + 1n; i < block.number; i++) {
              const block2 = await getAction(client, getBlock, "getBlock")({
                blockNumber: i,
                includeTransactions
              });
              emit.onBlock(block2, prevBlock);
              prevBlock = block2;
            }
          }
        }
        if (
          // If no previous block exists, emit.
          prevBlock?.number == null || // If the block tag is "pending" with no block number, emit.
          blockTag === "pending" && block?.number == null || // If the next block number is greater than the previous block number, emit.
          // We don't want to emit blocks in the past.
          block.number !== null && block.number > prevBlock.number
        ) {
          emit.onBlock(block, prevBlock);
          prevBlock = block;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlocks = () => {
    let active = true;
    let emitFetched = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        if (emitOnBegin) {
          getAction(client, getBlock, "getBlock")({
            blockTag,
            includeTransactions
          }).then((block) => {
            if (!active)
              return;
            if (!emitFetched)
              return;
            onBlock(block, void 0);
            emitFetched = false;
          }).catch(onError);
        }
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["newHeads"],
          async onData(data) {
            if (!active)
              return;
            const block = await getAction(client, getBlock, "getBlock")({
              blockNumber: data.result?.number,
              includeTransactions
            }).catch(() => {
            });
            if (!active)
              return;
            onBlock(block, prevBlock);
            emitFetched = false;
            prevBlock = block;
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollBlocks() : subscribeBlocks();
}

// ../node_modules/viem/_esm/actions/public/watchEvent.js
function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const strict = strict_ ?? false;
  const pollEvent = () => {
    const observerId = stringify([
      "watchEvent",
      address,
      args,
      batch,
      client.uid,
      event,
      pollingInterval,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createEventFilter, "createEventFilter")({
              address,
              args,
              event,
              events,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber !== blockNumber) {
              logs = await getAction(client, getLogs, "getLogs")({
                address,
                args,
                event,
                events,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeEvent = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const events_ = events ?? (event ? [event] : void 0);
        let topics = [];
        if (events_) {
          const encoded = events_.flatMap((event2) => encodeEventTopics({
            abi: [event2],
            eventName: event2.name,
            args
          }));
          topics = [encoded];
          if (event)
            topics = topics[0];
        }
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["logs", { address, topics }],
          onData(data) {
            if (!active)
              return;
            const log = data.result;
            try {
              const { eventName, args: args2 } = decodeEventLog({
                abi: events_ ?? [],
                data: log.data,
                topics: log.topics,
                strict
              });
              const formatted = formatLog(log, { args: args2, eventName });
              onLogs([formatted]);
            } catch (err) {
              let eventName;
              let isUnnamed;
              if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                if (strict_)
                  return;
                eventName = err.abiItem.name;
                isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
              }
              const formatted = formatLog(log, {
                args: isUnnamed ? [] : {},
                eventName
              });
              onLogs([formatted]);
            }
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollEvent() : subscribeEvent();
}

// ../node_modules/viem/_esm/actions/public/watchPendingTransactions.js
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket" && client.transport.type !== "ipc";
  const pollPendingTransactions = () => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter;
      const unwatch = poll(async () => {
        try {
          if (!filter) {
            try {
              filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
              return;
            } catch (err) {
              unwatch();
              throw err;
            }
          }
          const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          if (hashes.length === 0)
            return;
          if (batch)
            emit.onTransactions(hashes);
          else
            for (const hash2 of hashes)
              emit.onTransactions([hash2]);
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribePendingTransactions = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(data) {
            if (!active)
              return;
            const transaction = data.result;
            onTransactions([transaction]);
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
}

// ../node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
var siweDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
function isValidSiweDateTime(value) {
  if (!siweDateTimeRegex.test(value))
    return false;
  return !Number.isNaN(new Date(value).getTime());
}
function parseSiweDateTime(value) {
  if (!isValidSiweDateTime(value))
    return new Date(Number.NaN);
  return new Date(value);
}
function parseSiweMessage(message) {
  const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
  const { chainId, expirationTime, issuedAt, notBefore, requestId, resources: resources_, ...suffix } = message.match(suffixRegex)?.groups ?? {};
  const resources = resources_?.split("\n- ").slice(1);
  return {
    ...prefix,
    ...suffix,
    ...chainId ? { chainId: Number(chainId) } : {},
    ...expirationTime ? { expirationTime: parseSiweDateTime(expirationTime) } : {},
    ...issuedAt ? { issuedAt: parseSiweDateTime(issuedAt) } : {},
    ...notBefore ? { notBefore: parseSiweDateTime(notBefore) } : {},
    ...requestId ? { requestId } : {},
    ...resources ? { resources } : {},
    ...scheme ? { scheme } : {},
    ...statement ? { statement } : {}
  };
}
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+\-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.*))?(?:\nResources:(?<resources>(?:\n- .+)*))?/;

// ../node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
function validateSiweMessage(parameters) {
  const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = parameters;
  if (domain && message.domain !== domain)
    return false;
  if (nonce && message.nonce !== nonce)
    return false;
  if (scheme && message.scheme !== scheme)
    return false;
  if (Number.isNaN(time.getTime()))
    return false;
  if (message.expirationTime) {
    if (Number.isNaN(message.expirationTime.getTime()))
      return false;
    if (time >= message.expirationTime)
      return false;
  }
  if (message.notBefore) {
    if (Number.isNaN(message.notBefore.getTime()))
      return false;
    if (time < message.notBefore)
      return false;
  }
  try {
    if (!message.address)
      return false;
    if (!isAddress(message.address, { strict: false }))
      return false;
    if (address && !isAddressEqual(message.address, address))
      return false;
  } catch {
    return false;
  }
  return true;
}

// ../node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
async function verifySiweMessage(client, parameters) {
  const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
  const parsed = parseSiweMessage(message);
  if (!parsed.address)
    return false;
  const isValid = validateSiweMessage({
    address,
    domain,
    message: parsed,
    nonce,
    scheme,
    time
  });
  if (!isValid)
    return false;
  const hash2 = hashMessage(message);
  return verifyHash(client, {
    address: parsed.address,
    hash: hash2,
    signature,
    ...callRequest
  });
}

// ../node_modules/viem/_esm/actions/token/internal.js
function toAmount(amount, decimals) {
  return { amount, decimals, formatted: formatUnits(amount, decimals) };
}
function resolveToken(client, parameters) {
  const { decimals, token } = parameters;
  const declared = findDeclaredToken(client, token);
  if (declared)
    return {
      address: declared.address,
      decimals: decimals ?? declared.decimals
    };
  if (isAddress(token, { strict: false }))
    return {
      address: token,
      decimals: decimals ?? inferDecimals(client, token)
    };
  throw new Error(`Token "${token}" is not a declared ERC-20 token on the client's \`tokens\` array (with an address for the client's chain), and is not a valid address.`);
}
function findDeclaredToken(client, token) {
  const tokens = client.tokens;
  const chainId = client.chain?.id;
  if (!tokens || chainId === void 0)
    return void 0;
  const bySymbol = findTokenBySymbol(tokens, token);
  if (bySymbol)
    return resolveTokenForChain(bySymbol, chainId);
  if (isAddress(token, { strict: false }))
    for (const token_ of tokens) {
      const resolved = resolveTokenForChain(token_, chainId);
      if (resolved && isAddressEqual(resolved.address, token))
        return resolved;
    }
  return void 0;
}
function resolveTokenForChain(token, chainId) {
  const address = token.addresses[chainId];
  if (!address)
    return void 0;
  return {
    address,
    currency: token.currency,
    decimals: token.decimals,
    name: token.name,
    popular: token.popular,
    symbol: token.symbol
  };
}
function findTokenBySymbol(tokens, symbol) {
  const lowerSymbol = symbol.toLowerCase();
  for (const token of tokens) {
    if (token.symbol?.toLowerCase() === lowerSymbol)
      return token;
  }
  return void 0;
}
function inferDecimals(client, address) {
  const tokens = client.tokens;
  const chainId = client.chain?.id;
  if (tokens && chainId !== void 0)
    for (const token of tokens) {
      const resolved = resolveTokenForChain(token, chainId);
      if (resolved && isAddressEqual(resolved.address, address))
        return resolved.decimals;
    }
  return void 0;
}
async function resolveTokenWithDecimals(client, parameters) {
  const { address, decimals } = resolveToken(client, parameters);
  if (decimals !== void 0)
    return { address, decimals };
  return {
    address,
    decimals: await readContract(client, {
      abi: erc20Abi,
      address,
      functionName: "decimals"
    })
  };
}
function defineCall(call2) {
  return {
    ...call2,
    data: encodeFunctionData(call2),
    to: call2.address
  };
}

// ../node_modules/viem/_esm/actions/wallet/sendRawTransactionSync.js
async function sendRawTransactionSync(client, { serializedTransaction, throwOnReceiptRevert, timeout }) {
  const receipt = await client.request({
    method: "eth_sendRawTransactionSync",
    params: timeout ? [serializedTransaction, timeout] : [serializedTransaction]
  }, { retryCount: 0 });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  const formatted = format2(receipt);
  if (formatted.status === "reverted" && throwOnReceiptRevert)
    throw new TransactionReceiptRevertedError({ receipt: formatted });
  return formatted;
}

// ../node_modules/viem/_esm/actions/token/getAllowance.js
async function getAllowance(client, parameters) {
  const { account, decimals, spender, token, ...rest } = parameters;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getAllowance.call(client, { account, spender, token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getAllowance2) {
  function call2(client, args) {
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [args.account, args.spender]
    });
  }
  getAllowance2.call = call2;
})(getAllowance || (getAllowance = {}));

// ../node_modules/viem/_esm/actions/token/getBalance.js
async function getBalance2(client, parameters) {
  const { account: account_ = client.account, decimals, token, ...rest } = parameters;
  if (!account_)
    throw new AccountNotFoundError();
  const account = parseAccount(account_).address;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getBalance2.call(client, { account, token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getBalance3) {
  function call2(client, args) {
    const account_ = args.account ?? client.account;
    if (!account_)
      throw new AccountNotFoundError();
    const account = parseAccount(account_).address;
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account]
    });
  }
  getBalance3.call = call2;
})(getBalance2 || (getBalance2 = {}));

// ../node_modules/viem/_esm/actions/token/getMetadata.js
async function getMetadata(client, parameters) {
  const { token, ...rest } = parameters;
  const { address } = resolveToken(client, { token });
  const declared = findDeclaredToken(client, token);
  const [decimals_, name, symbol] = await Promise.all([
    declared?.decimals ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "decimals"
    }),
    declared?.name ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "name"
    }),
    declared?.symbol ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "symbol"
    })
  ]);
  return {
    decimals: decimals_,
    name,
    symbol
  };
}

// ../node_modules/viem/_esm/actions/token/getTotalSupply.js
async function getTotalSupply(client, parameters) {
  const { decimals, token, ...rest } = parameters;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getTotalSupply.call(client, { token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getTotalSupply2) {
  function call2(client, args) {
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      args: [],
      functionName: "totalSupply"
    });
  }
  getTotalSupply2.call = call2;
})(getTotalSupply || (getTotalSupply = {}));

// ../node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
  return {
    call: (args) => call(client, args),
    createAccessList: (args) => createAccessList(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createContractEventFilter: (args) => createContractEventFilter(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createPendingTransactionFilter: () => createPendingTransactionFilter(client),
    estimateContractGas: (args) => estimateContractGas(client, args),
    estimateGas: (args) => estimateGas(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlobBaseFee: () => getBlobBaseFee(client),
    getBlock: (args) => getBlock(client, args),
    getBlockNumber: (args) => getBlockNumber(client, args),
    getBlockReceipts: (args) => getBlockReceipts(client, args),
    getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
    getBytecode: (args) => getCode(client, args),
    getChainId: () => getChainId(client),
    getCode: (args) => getCode(client, args),
    getContractEvents: (args) => getContractEvents(client, args),
    getDelegation: (args) => getDelegation(client, args),
    getEip712Domain: (args) => getEip712Domain(client, args),
    getEnsAddress: (args) => getEnsAddress(client, args),
    getEnsAvatar: (args) => getEnsAvatar(client, args),
    getEnsName: (args) => getEnsName(client, args),
    getEnsResolver: (args) => getEnsResolver(client, args),
    getEnsText: (args) => getEnsText(client, args),
    getFeeHistory: (args) => getFeeHistory(client, args),
    estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    getGasPrice: () => getGasPrice(client),
    getLogs: (args) => getLogs(client, args),
    getProof: (args) => getProof(client, args),
    estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
    fillTransaction: (args) => fillTransaction(client, args),
    getRawTransaction: (args) => getRawTransaction(client, args),
    getStorageAt: (args) => getStorageAt(client, args),
    getStorageValues: (args) => getStorageValues(client, args),
    getTransaction: (args) => getTransaction(client, args),
    getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
    getTransactionCount: (args) => getTransactionCount(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    multicall: (args) => multicall(client, args),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    readContract: (args) => readContract(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
    simulate: (args) => simulateBlocks(client, args),
    simulateBlocks: (args) => simulateBlocks(client, args),
    simulateCalls: (args) => simulateCalls(client, args),
    simulateContract: (args) => simulateContract(client, args),
    verifyHash: (args) => verifyHash(client, args),
    verifyMessage: (args) => verifyMessage(client, args),
    verifySiweMessage: (args) => verifySiweMessage(client, args),
    verifyTypedData: (args) => verifyTypedData(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
    watchBlockHeaders: (args) => watchBlockHeaders(client, args),
    watchBlocks: (args) => watchBlocks(client, args),
    watchBlockNumber: (args) => watchBlockNumber(client, args),
    watchContractEvent: (args) => watchContractEvent(client, args),
    watchEvent: (args) => watchEvent(client, args),
    watchPendingTransactions: (args) => watchPendingTransactions(client, args),
    token: bindPublicToken(client)
  };
}
function bindPublicToken(client) {
  return {
    getAllowance: bindActionDecorators(client, getAllowance),
    getBalance: bindActionDecorators(client, getBalance2),
    getMetadata: bindActionDecorators(client, getMetadata),
    getTotalSupply: bindActionDecorators(client, getTotalSupply)
  };
}

// ../node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key: key2, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
  return {
    config: {
      key: key2,
      methods,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
    value
  };
}

// ../node_modules/viem/_esm/errors/transport.js
var UrlRequiredError = class extends BaseError {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
};

// ../node_modules/viem/_esm/clients/transports/http.js
var signalId = 0;
var signalIds = /* @__PURE__ */ new WeakMap();
function getSignalId(signal) {
  if (!signal)
    return "default";
  const id = signalIds.get(signal);
  if (id !== void 0)
    return id;
  const nextId = signalId++;
  signalIds.set(signal, nextId);
  return nextId;
}
function http(url, config = {}) {
  const { batch, fetchFn, fetchOptions, key: key2 = "http", maxResponseBodySize, methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchFn,
      fetchOptions,
      maxResponseBodySize,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key: key2,
      methods,
      name,
      async request({ method, params }, options) {
        const body = { method, params };
        const fetchOptions2 = options?.signal ? { signal: options.signal } : void 0;
        const { schedule } = createBatchScheduler({
          id: `${url_}.${getSignalId(options?.signal)}`,
          wait: wait2,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: (body2) => rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          })
        ];
        const [{ error, result }] = await fn(body);
        if (raw)
          return { error, result };
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}

// ../node_modules/viem/_esm/clients/transports/webSocket.js
function webSocket(url, config = {}) {
  const { keepAlive, key: key2 = "webSocket", methods, name = "WebSocket JSON-RPC", reconnect, retryDelay } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.webSocket?.[0];
    const wsRpcClientOpts = { keepAlive, reconnect };
    if (!url_)
      throw new UrlRequiredError();
    return createTransport({
      key: key2,
      methods,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
        const { error, result } = await rpcClient.requestAsync({
          body,
          timeout
        });
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "webSocket"
    }, {
      getSocket() {
        return getSocket(url_);
      },
      getRpcClient() {
        return getWebSocketRpcClient(url_, wsRpcClientOpts);
      },
      async subscribe({ params, onData, onError }) {
        const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
        let subscriptionId;
        let unsubscribed = false;
        function unsubscribe() {
          unsubscribed = true;
          return new Promise((resolve2) => rpcClient.request({
            body: {
              method: "eth_unsubscribe",
              params: [subscriptionId]
            },
            onResponse: resolve2
          }));
        }
        await new Promise((resolve2, reject) => rpcClient.request({
          body: {
            method: "eth_subscribe",
            params
          },
          onError(error) {
            reject(error);
            onError?.(error);
            return;
          },
          onResponse(response) {
            if (response.error) {
              reject(response.error);
              onError?.(response.error);
              return;
            }
            if (typeof response.id === "number") {
              subscriptionId = response.result;
              if (unsubscribed)
                unsubscribe();
              resolve2(response);
              return;
            }
            if (response.method !== "eth_subscription")
              return;
            onData(response.params);
          }
        }));
        return {
          get subscriptionId() {
            return subscriptionId;
          },
          unsubscribe
        };
      }
    });
  };
}

// ../node_modules/@arkiv-network/sdk/dist/chains-DmrgfF3p.js
var __defProp = Object.defineProperty;
var __export2 = (all) => {
  let target = {};
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
  return target;
};
var localhost = defineChain({
  id: 1337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } }
});
var tiramisu = defineChain({
  id: 7738577,
  name: "Tiramisu",
  network: "tiramisu",
  nativeCurrency: {
    name: "Golem",
    symbol: "GLM",
    decimals: 18
  },
  rpcUrls: { default: {
    http: ["https://rpc.tiramisu.db-chain.testnet.arkiv.network"],
    webSocket: ["wss://rpc.tiramisu.db-chain.testnet.arkiv.network"]
  } },
  testnet: true
});
var chains_exports = /* @__PURE__ */ __export2({
  localhost: () => localhost,
  tiramisu: () => tiramisu
});

// ../node_modules/@arkiv-network/sdk/dist/attr-tmyREHtw.js
var InvalidValueError = class extends Error {
  /** The type tag whose constructor rejected the value. */
  tag;
  /** The rejected input, as given. */
  input;
  constructor(tag, input2, reason, hint) {
    super(`Invalid ${tag} value ${describe(input2)}: ${reason}.${hint ? ` ${hint}` : ""}`);
    this.name = "InvalidValueError";
    this.tag = tag;
    this.input = input2;
  }
};
var UntypedValueError = class extends Error {
  input;
  constructor(input2) {
    super(`Cannot infer an Arkiv type for ${describe(input2)}. Attribute values must be a tagged value (i32, u64, u256, dec, str, addr, key, bytes32, bool) or a bare boolean, number, bigint or string.`);
    this.name = "UntypedValueError";
    this.input = input2;
  }
};
var MissingValueError = class extends Error {
  /** The attribute whose value was missing, when raised from an attribute map. */
  attributeName;
  constructor(input2, attributeName) {
    const subject = attributeName ? `attribute "${attributeName}"` : "attribute value";
    super(`The ${subject} is ${input2 === null ? "null" : "undefined"}. An attribute is either set with a value and a type or not set at all, so there is nothing to write here. ` + (attributeName ? `Omit "${attributeName}" from the attributes instead \u2014 e.g. build the map conditionally, or drop the key when the value is absent.` : "Omit the attribute instead of giving it an empty value."));
    this.name = "MissingValueError";
    this.attributeName = attributeName;
  }
};
var InvalidAttributeNameError = class extends Error {
  attributeName;
  constructor(attributeName, reason) {
    super(`Invalid attribute name "${attributeName}": ${reason}. Names must be 1-32 bytes, start with a letter, and contain only A-Z, a-z, 0-9, ".", "-" or "_". Names are case-sensitive.`);
    this.name = "InvalidAttributeNameError";
    this.attributeName = attributeName;
  }
};
var UnknownAttributeTypeError = class extends Error {
  /** The type as the node named it — a tag over JSON-RPC, a typeId on the wire. */
  type;
  constructor(type) {
    super(`Unknown attribute type ${describe(type)}. The node is using a type this SDK version does not know about \u2014 upgrade @arkiv-network/sdk.`);
    this.name = "UnknownAttributeTypeError";
    this.type = type;
  }
};
function describe(input2) {
  switch (typeof input2) {
    case "string":
      return JSON.stringify(input2.length > 64 ? `${input2.slice(0, 61)}...` : input2);
    case "bigint":
      return `${input2}n`;
    case "object":
      return input2 === null ? "null" : safeJson(input2);
    case "undefined":
      return "undefined";
    default:
      return String(input2);
  }
}
function safeJson(input2) {
  try {
    return JSON.stringify(input2) ?? String(input2);
  } catch {
    return Object.prototype.toString.call(input2);
  }
}
var DECIMAL_SCALE = 18;
var DECIMAL_UNIT = 10n ** BigInt(DECIMAL_SCALE);
var INT256_MAX = 2n ** 255n - 1n;
var INT256_MIN = -(2n ** 255n);
var DECIMAL_RE = /^([+-]?)(\d+)(?:\.(\d+))?$/;
function decimalToUnits(input2) {
  const match = DECIMAL_RE.exec(input2);
  if (!match) throw new InvalidValueError("dec", input2, "not a decimal literal", 'Write it as sign, digits, and an optional "." with up to 18 fractional digits \u2014 e.g. dec("3.5") or dec("-0.25"). Exponents such as "1e18" are not accepted.');
  const [, sign, whole, fraction = ""] = match;
  if (fraction.length > DECIMAL_SCALE) throw new InvalidValueError("dec", input2, `${fraction.length} fractional digits exceeds the ${DECIMAL_SCALE} the protocol stores`, "Round it yourself before storing \u2014 a dec is never rounded for you, so that what you write is exactly what is stored.");
  const digits = BigInt(whole + fraction.padEnd(DECIMAL_SCALE, "0"));
  const units = sign === "-" ? -digits : digits;
  if (units > INT256_MAX || units < INT256_MIN) throw new InvalidValueError("dec", input2, "exceeds the int256 range a dec is stored in");
  return units;
}
function unitsToDecimal(units) {
  if (units > INT256_MAX || units < INT256_MIN) throw new InvalidValueError("dec", units, "exceeds the int256 range a dec is stored in");
  const negative = units < 0n;
  const magnitude = negative ? -units : units;
  const whole = magnitude / DECIMAL_UNIT;
  const trimmed = (magnitude % DECIMAL_UNIT).toString().padStart(DECIMAL_SCALE, "0").replace(/0+$/, "");
  const sign = negative ? "-" : "";
  return trimmed ? `${sign}${whole}.${trimmed}` : `${sign}${whole}`;
}
var TYPE_IDS = {
  bool: 1,
  i32: 2,
  u64: 3,
  u256: 4,
  dec: 5,
  bytes32: 6,
  bytes: 7,
  str: 8,
  addr: 9,
  key: 10
};
function makeValue(type, value) {
  return {
    type,
    value
  };
}
function isArkivValue(input2) {
  return typeof input2 === "object" && input2 !== null && "type" in input2 && "value" in input2 && typeof input2.type === "string" && Object.hasOwn(TYPE_IDS, input2.type);
}
var I32_MAX = 2147483647;
var I32_MIN = -2147483648;
var U64_MAX = 2n ** 64n - 1n;
var U256_MAX = 2n ** 256n - 1n;
var MAX_STRING_BYTES = 128;
function findControlChar(value) {
  for (let index2 = 0; index2 < value.length; index2++) {
    const code = value.charCodeAt(index2);
    if (code <= 31 || code === 127) return {
      index: index2,
      code
    };
  }
}
function bool(value) {
  if (typeof value !== "boolean") throw new InvalidValueError("bool", value, "not a boolean");
  return makeValue("bool", value);
}
function i32(value) {
  if (typeof value === "bigint") {
    if (value > BigInt(I32_MAX) || value < BigInt(I32_MIN)) throw new InvalidValueError("i32", value, outOfI32Range(value >= 0n));
    return makeValue("i32", Number(value));
  }
  if (typeof value !== "number" || !Number.isFinite(value)) throw new InvalidValueError("i32", value, "not a number");
  if (!Number.isInteger(value)) throw new InvalidValueError("i32", value, "not an integer", `Use dec(${JSON.stringify(String(value))}) for a fixed-point decimal.`);
  if (value > I32_MAX || value < I32_MIN) throw new InvalidValueError("i32", value, outOfI32Range(value >= 0));
  return makeValue("i32", value);
}
function outOfI32Range(nonNegative) {
  const range = `outside the i32 range [${I32_MIN}, ${I32_MAX}]`;
  return nonNegative ? `${range} \u2014 use u64(...) for large counters, timestamps and block heights (Date.now() does not fit an i32), or u256(...) beyond 2**64 - 1` : `${range} \u2014 use dec(...) for values that need more range than an i32`;
}
function u256(value) {
  return makeValue("u256", toUnsigned("u256", value, U256_MAX));
}
function u64(value) {
  return makeValue("u64", toUnsigned("u64", value, U64_MAX));
}
function toUnsigned(tag, value, max) {
  const parsed = toUnsignedBigint(tag, value);
  if (parsed < 0n) throw new InvalidValueError(tag, value, `negative \u2014 ${tag} is unsigned`, "Use i32(...) for small signed integers, or dec(...) for a signed fixed-point value.");
  if (parsed > max) throw new InvalidValueError(tag, value, `wider than ${tag === "u64" ? 64 : 256} bits`, tag === "u64" ? "Use u256(...) for values beyond 2**64 - 1." : void 0);
  return parsed;
}
function toUnsignedBigint(tag, value) {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") {
    if (!Number.isInteger(value)) throw new InvalidValueError(tag, value, "not an integer", `Use dec(${JSON.stringify(String(value))}) for a fixed-point decimal.`);
    if (!Number.isSafeInteger(value)) throw new InvalidValueError(tag, value, "beyond the safe integer range, so it may already have lost precision", "Pass it as a bigint literal (e.g. 12345678901234567890n) or a string instead.");
    return BigInt(value);
  }
  if (typeof value === "string") {
    if (!/^(0x[0-9a-fA-F]+|\d+)$/.test(value)) throw new InvalidValueError(tag, value, "not a decimal or 0x-hex integer");
    return BigInt(value);
  }
  throw new InvalidValueError(tag, value, "not a bigint, number or string");
}
function dec(value) {
  if (typeof value === "string") return makeValue("dec", unitsToDecimal(decimalToUnits(value)));
  if (typeof value === "bigint") return decFromUnits(value * DECIMAL_UNIT);
  if (typeof value !== "number" || !Number.isFinite(value)) throw new InvalidValueError("dec", value, "not a number");
  if (!Number.isInteger(value)) throw new InvalidValueError("dec", value, "a fractional number cannot be represented exactly in binary floating point", `Pass it as a string instead: dec(${JSON.stringify(String(value))}).`);
  return decFromUnits(BigInt(value) * DECIMAL_UNIT);
}
function decFromUnits(units) {
  return makeValue("dec", unitsToDecimal(units));
}
function str(value) {
  if (typeof value !== "string") throw new InvalidValueError("str", value, "not a string");
  const control = findControlChar(value);
  if (control !== void 0) throw new InvalidValueError("str", value, `contains the control character U+${control.code.toString(16).padStart(4, "0").toUpperCase()} at index ${control.index}`, "A str is written into a query as str('...'), whose only escape is a doubled quote \u2014 there is no spelling for a control character, so this value could be stored but never queried. Free-form text belongs in the entity payload; keep a short, printable key here.");
  const bytes = stringToBytes(value).length;
  if (bytes > MAX_STRING_BYTES) throw new InvalidValueError("str", value, `${bytes} UTF-8 bytes exceeds the ${MAX_STRING_BYTES}-byte limit on a str`, "Store the long form in the entity payload and keep a short, queryable key here.");
  return makeValue("str", value);
}
function addr(value) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new InvalidValueError("addr", value, "not a 20-byte 0x-prefixed hex address");
  const body = value.slice(2);
  if (body !== body.toLowerCase() && body !== body.toUpperCase() && !isAddress(value, { strict: true })) throw new InvalidValueError("addr", value, "fails its EIP-55 checksum, so a digit is probably mistyped", `If those hex digits are right, the correctly checksummed form is ${checksumAddress(value)}.`);
  return makeValue("addr", checksumAddress(value));
}
function key(value) {
  return makeValue("key", asFixedHex("key", value, 32));
}
function bytes32(value) {
  return makeValue("bytes32", asFixedHex("bytes32", value, 32));
}
function asFixedHex(tag, value, size$1) {
  if (value instanceof Uint8Array) {
    if (value.length !== size$1) throw new InvalidValueError(tag, `<${value.length} bytes>`, `not exactly ${size$1} bytes`);
    return toHex(value);
  }
  if (typeof value !== "string" || !isHex(value, { strict: true })) throw new InvalidValueError(tag, value, "not 0x-prefixed hex");
  if (value.length !== 2 + size$1 * 2) throw new InvalidValueError(tag, value, `${(value.length - 2) / 2} bytes, not exactly ${size$1} bytes`);
  return value.toLowerCase();
}
function toValue(input2, attributeName) {
  if (input2 === void 0 || input2 === null) throw new MissingValueError(input2, attributeName);
  switch (typeof input2) {
    case "boolean":
      return bool(input2);
    case "number":
      return i32(input2);
    case "bigint":
      return u256(input2);
    case "string":
      return str(input2);
    default: {
      const candidate = input2;
      if (isArkivValue(candidate)) {
        if (candidate.type === "bytes") throw new InvalidValueError("bytes", candidate.value, "system-only \u2014 bytes backs the entity payload and cannot be set as an attribute", "Pass the bytes as the entity payload instead.");
        return revalidate(candidate);
      }
      throw new UntypedValueError(input2);
    }
  }
}
function revalidate(value) {
  switch (value.type) {
    case "bool":
      return bool(value.value);
    case "i32":
      return i32(value.value);
    case "u64":
      return u64(value.value);
    case "u256":
      return u256(value.value);
    case "dec":
      return dec(value.value);
    case "bytes32":
      return bytes32(value.value);
    case "str":
      return str(value.value);
    case "addr":
      return addr(value.value);
    case "key":
      return key(value.value);
  }
}
function strFromChain(value) {
  return makeValue("str", value);
}
function decodeRpcValue(type, value) {
  switch (asTypeTag(type)) {
    case "bool":
      return bool(asBoolean(value));
    case "i32":
      return i32(Number(asIntegerish("i32", value)));
    case "u64":
      return u64(asIntegerish("u64", value));
    case "u256":
      return u256(asIntegerish("u256", value));
    case "dec":
      return dec(asString("dec", value));
    case "bytes32":
      return bytes32(asString("bytes32", value));
    case "key":
      return key(asString("key", value));
    case "addr":
      return addr(asString("addr", value));
    case "str":
      return strFromChain(asString("str", value));
    case "bytes":
      return makeValue("bytes", asString("bytes", value).toLowerCase());
  }
}
function asTypeTag(type) {
  if (typeof type !== "string" || !Object.hasOwn(TYPE_IDS, type)) throw new UnknownAttributeTypeError(type);
  return type;
}
function asBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "false") return value === "true";
  throw new InvalidValueError("bool", value, "not a boolean");
}
function asString(tag, value) {
  if (typeof value !== "string") throw new InvalidValueError(tag, value, `expected a string, got ${typeof value}`);
  return value;
}
function asIntegerish(tag, value) {
  if (typeof value === "number") {
    if (!Number.isInteger(value)) throw new InvalidValueError(tag, value, "not an integer");
    return BigInt(value);
  }
  if (typeof value === "bigint") return value;
  if (typeof value === "string") {
    if (/^0x[0-9a-fA-F]+$/.test(value)) return BigInt(value);
    if (/^-?\d+$/.test(value)) return BigInt(value);
  }
  throw new InvalidValueError(tag, value, "not an integer");
}
var MAX_NAME_BYTES = 32;
var NAME_RE = /^[A-Za-z][A-Za-z0-9._-]*$/;
var RESERVED = /* @__PURE__ */ new Set([
  "and",
  "or",
  "not",
  "true",
  "false",
  "startswith",
  "exists",
  "typeof",
  "bool",
  "i32",
  "u64",
  "u256",
  "dec",
  "bytes32",
  "bytes",
  "str",
  "addr",
  "key"
]);
function validateAttributeName(name) {
  if (typeof name !== "string" || name.length === 0) throw new InvalidAttributeNameError(String(name), "the name is empty");
  if (name.startsWith("$")) throw new InvalidAttributeNameError(name, '"$" is reserved for system attributes, which the engine sets and you cannot write');
  if (!NAME_RE.test(name)) {
    const chars = [...name];
    const at = chars.findIndex((char, index2) => !(index2 === 0 ? /[A-Za-z]/ : /[A-Za-z0-9._-]/).test(char));
    throw new InvalidAttributeNameError(name, at === 0 ? `it starts with "${chars[0]}" rather than a letter` : `it contains "${chars[at]}" at position ${at}`);
  }
  if (name.length > MAX_NAME_BYTES) throw new InvalidAttributeNameError(name, `the name is ${name.length} bytes long`);
  if (name.includes("--")) throw new InvalidAttributeNameError(name, '"--" opens a comment in the query language, so everything after it in a query would be discarded \u2014 an attribute with this name could be written but never safely queried');
  if (RESERVED.has(name.toLowerCase())) throw new InvalidAttributeNameError(name, `"${name}" is reserved by the query language, so an attribute with this name could never be queried`);
}
var MAX_PAYLOAD_BYTES = 128 * 1024;

// ../node_modules/@arkiv-network/sdk/dist/errors-D2E1GRjw.js
var InvalidCreationFlagsError = class extends Error {
  constructor(reason) {
    super(`Invalid creation flags: ${reason}`);
    this.name = "InvalidCreationFlagsError";
  }
};
var InvalidSaltError = class extends Error {
  constructor(salt) {
    super(`Invalid salt ${String(salt)}. A salt is a uint128, so it must be between 0 and ${2n ** 128n - 1n}. Omit it to get 128 random bits, or pass NO_SALT for a key derived from the owner and nonce alone.`);
    this.name = "InvalidSaltError";
  }
};
var NoRandomSourceError = class extends Error {
  constructor() {
    super("No cryptographic random source is available (globalThis.crypto.getRandomValues is missing), so a key salt cannot be generated. Upgrade to Node 18+ or a modern browser, or pass an explicit salt.");
    this.name = "NoRandomSourceError";
  }
};

// ../node_modules/@arkiv-network/sdk/dist/flags-DUT2gHEU.js
var READONLY_BIT = 1;
var PERMISSIONLESS_EXTENSION_BIT = 2;
function encodeCreationFlags(flags = {}) {
  for (const [name, value] of Object.entries(flags)) if (value !== void 0 && typeof value !== "boolean") throw new InvalidCreationFlagsError(`"${name}" must be a boolean, got ${typeof value}`);
  return (flags.readonly ? READONLY_BIT : 0) | (flags.permissionlessExtension ? PERMISSIONLESS_EXTENSION_BIT : 0);
}
function decodeCreationFlags(raw) {
  if (!Number.isInteger(raw) || raw < 0 || raw > 255) throw new InvalidCreationFlagsError(`${raw} is not a byte`);
  return {
    readonly: (raw & READONLY_BIT) !== 0,
    permissionlessExtension: (raw & PERMISSIONLESS_EXTENSION_BIT) !== 0,
    raw
  };
}

// ../node_modules/@arkiv-network/sdk/dist/entity-BIp_df9u.js
var Entity = class {
  key;
  owner;
  creator;
  createdAt;
  updatedAt;
  expiresAt;
  creationFlags;
  contentType;
  payload;
  attributeSchema;
  attributes;
  constructor(fields = {}) {
    this.key = fields.key;
    this.owner = fields.owner;
    this.creator = fields.creator;
    this.createdAt = fields.createdAt;
    this.updatedAt = fields.updatedAt;
    this.expiresAt = fields.expiresAt;
    this.creationFlags = fields.creationFlags;
    this.contentType = fields.contentType;
    this.payload = fields.payload;
    this.attributeSchema = fields.attributeSchema;
    this.attributes = fields.attributes;
  }
  /**
  * The payload decoded as UTF-8 text.
  *
  * @throws If the payload was not selected, or is not valid UTF-8.
  */
  toText() {
    if (this.payload === void 0) throw new Error("Entity has no payload \u2014 the query did not select it. Use select({ payload: true }).");
    try {
      return bytesToString(this.payload);
    } catch (e) {
      throw new Error(`Failed to convert entity payload to text: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
    }
  }
  /**
  * The payload parsed as JSON.
  *
  * @throws If the payload was not selected, is empty, or is not valid JSON.
  */
  toJson() {
    const text = this.toText();
    if (!text) throw new Error("Entity has empty payload, cannot parse as JSON");
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Failed to parse entity payload as JSON: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
    }
  }
};

// ../node_modules/@arkiv-network/sdk/dist/query-Ber-lOJQ.js
var ROOT_NAMESPACE = "arkiv";
function getDebugEnv() {
  if (typeof process !== "undefined") {
    const debugEnv = process?.env?.DEBUG;
    if (debugEnv) return debugEnv;
  }
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) try {
    return globalThis.localStorage?.getItem("DEBUG") || "";
  } catch {
  }
  return "";
}
function matchesPattern(namespace, pattern) {
  if (pattern === namespace) return true;
  if (pattern.endsWith("*")) {
    const prefix = pattern.slice(0, -1);
    return namespace.startsWith(prefix);
  }
  if (pattern.startsWith("-")) return !matchesPattern(namespace, pattern.slice(1));
  return false;
}
function isEnabled(namespace) {
  const debugEnv = getDebugEnv();
  if (!debugEnv) return false;
  const patterns = debugEnv.split(/[\s,]+/).filter((p) => p.length > 0);
  if (patterns.length === 0) return false;
  let enabled = false;
  for (const pattern of patterns) if (pattern.startsWith("-")) {
    if (matchesPattern(namespace, pattern)) return false;
  } else if (matchesPattern(namespace, pattern)) enabled = true;
  return enabled;
}
var enabledNamespaces = /* @__PURE__ */ new Set();
var disabledNamespaces = /* @__PURE__ */ new Set();
var COLOR_PALETTE = [
  "#0000FF",
  "#008000",
  "#FF0000",
  "#FF00FF",
  "#FFA500",
  "#800080",
  "#00CED1",
  "#FF1493",
  "#32CD32",
  "#1E90FF",
  "#FF4500",
  "#9370DB",
  "#00FA9A",
  "#FFD700",
  "#DC143C",
  "#00BFFF",
  "#FF69B4",
  "#20B2AA",
  "#DA70D6",
  "#4682B4"
];
var isNode = typeof process !== "undefined" && process.versions?.node != null;
var ANSI_COLORS = [
  "\x1B[94m",
  "\x1B[92m",
  "\x1B[91m",
  "\x1B[95m",
  "\x1B[93m",
  "\x1B[96m",
  "\x1B[35m",
  "\x1B[36m",
  "\x1B[32m",
  "\x1B[34m",
  "\x1B[33m",
  "\x1B[31m",
  "\x1B[90m",
  "\x1B[37m",
  "\x1B[1m"
];
var ANSI_RESET = "\x1B[0m";
var ANSI_BOLD = "\x1B[1m";
var namespaceColors = /* @__PURE__ */ new Map();
function getColorForNamespace(namespace) {
  const cachedColor = namespaceColors.get(namespace);
  if (cachedColor) return cachedColor;
  let hash2 = 0;
  for (let i = 0; i < namespace.length; i++) {
    const char = namespace.charCodeAt(i);
    hash2 = (hash2 << 5) - hash2 + char;
    hash2 = hash2 & hash2;
  }
  const colorIndex = Math.abs(hash2) % COLOR_PALETTE.length;
  const color = {
    css: COLOR_PALETTE[colorIndex] ?? "inherit",
    ansi: ANSI_COLORS[colorIndex % ANSI_COLORS.length] ?? ""
  };
  namespaceColors.set(namespace, color);
  return color;
}
function createDebugLogger(namespace) {
  const colors = getColorForNamespace(namespace);
  return (...args) => {
    const envEnabled = isEnabled(namespace);
    const progEnabled = enabledNamespaces.has(namespace) && !disabledNamespaces.has(namespace);
    if (envEnabled || progEnabled) if (isNode) {
      const coloredNamespace = `${ANSI_BOLD}${colors.ansi}${namespace}${ANSI_RESET}`;
      console.log(coloredNamespace, ...args);
    } else {
      const style1 = `color: ${colors.css}; font-weight: bold`;
      console.log(`%c${namespace}%c`, style1, "color: inherit; font-weight: normal", ...args);
    }
  };
}
var getLogger = (scope) => {
  return createDebugLogger(`${ROOT_NAMESPACE}:${scope}`);
};
var NoMoreResultsError = class extends Error {
  constructor() {
    super("No more results \u2014 the last page carried no cursor. Check hasNextPage() before next().");
    this.name = "NoMoreResultsError";
  }
};
var NoEntityFoundError = class extends Error {
  /** The key that matched nothing, when the lookup was by key. */
  entityKey;
  constructor(entityKey) {
    super(entityKey === void 0 ? "No entity found" : `No live entity with key ${entityKey}. It was never created, or it has been deleted or has expired.`);
    this.name = "NoEntityFoundError";
    this.entityKey = entityKey;
  }
};
var logger$1 = getLogger("utils:entities");
function decodeAttributes(rpcAttributes) {
  const attributes = {};
  for (const { name, type, value } of rpcAttributes) attributes[name] = decodeRpcValue(type, value);
  return attributes;
}
function decodeSchema(entries) {
  const schema = {};
  for (const { name, type } of entries) schema[name] = asTypeTag(type);
  return schema;
}
function entityFromRpcResult(rpcEntity) {
  logger$1("entityFromRpcResult %o", rpcEntity);
  return new Entity({
    key: rpcEntity.key,
    owner: toAddress(rpcEntity.owner),
    creator: toAddress(rpcEntity.creator),
    createdAt: toBlock(rpcEntity.createdAt),
    updatedAt: toBlock(rpcEntity.updatedAt),
    expiresAt: toBlock(rpcEntity.expiresAt),
    creationFlags: decodeFlags(rpcEntity.creationFlags),
    contentType: rpcEntity.contentType,
    payload: rpcEntity.payload !== void 0 ? hexToBytes(rpcEntity.payload) : void 0,
    attributeSchema: rpcEntity.attributeSchema !== void 0 ? decodeSchema(rpcEntity.attributeSchema) : void 0,
    attributes: rpcEntity.attributes !== void 0 ? decodeAttributes(rpcEntity.attributes) : void 0
  });
}
function toBlock(value) {
  return value === void 0 ? void 0 : BigInt(value);
}
function toAddress(value) {
  if (value === void 0) return void 0;
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
    logger$1("unreadable address %o", value);
    return value;
  }
  return checksumAddress(value);
}
function decodeFlags(value) {
  if (value === void 0) return void 0;
  const raw = toFlagsByte(typeof value === "number" ? value : value.raw);
  if (raw !== void 0) return decodeCreationFlags(raw);
  if (typeof value === "object" && (value.readonly ?? value.permissionlessExtension) !== void 0) return decodeCreationFlags(encodeCreationFlags({
    readonly: value.readonly ?? false,
    permissionlessExtension: value.permissionlessExtension ?? false
  }));
  logger$1("unreadable creationFlags %o", value);
}
function toFlagsByte(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" && /^(0x[0-9a-fA-F]+|\d+)$/.test(value) ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 255 ? parsed : void 0;
}
var UnsupportedOperatorError = class extends Error {
  /** The attribute the predicate names. */
  attributeName;
  /** The operator, as it would have been written in the query. */
  operator;
  /** The type of the value it was applied to. */
  tag;
  constructor(attributeName, operator, tag, hint) {
    super(`The query language does not define ${operator} for a ${tag}, so "${attributeName} ${operator} ..." cannot be expressed.${hint ? ` ${hint}` : ""}`);
    this.name = "UnsupportedOperatorError";
    this.attributeName = attributeName;
    this.operator = operator;
    this.tag = tag;
  }
};
var InvalidPredicateError = class extends Error {
  /** The attribute the predicate names, where there is one. */
  attributeName;
  constructor(message, attributeName) {
    super(message);
    this.name = "InvalidPredicateError";
    this.attributeName = attributeName;
  }
};
var QUERY_ERROR_KINDS = {
  [-32001]: "parse",
  [-32002]: "type",
  [-32003]: "literal",
  [-32004]: "limits",
  [-32005]: "cursor",
  [-32006]: "block"
};
var QueryError = class extends Error {
  /** Which failure this is. */
  kind;
  /** The JSON-RPC error code. */
  code;
  /** The machine-readable detail the node sent, if any — e.g. `{ position, expected, got }`. */
  data;
  /** The query string that was rejected. */
  query;
  constructor(kind, code, query2, data, detail) {
    super(`Query rejected (${kind}, ${code})${detail ? `: ${detail}` : ""}. Query: ${query2}`, { cause: data });
    this.name = "QueryError";
    this.kind = kind;
    this.code = code;
    this.data = data;
    this.query = query2;
  }
};
function asQueryError(error, query2) {
  let code;
  let data;
  let detail;
  let current = error;
  for (let depth = 0; current != null && depth < 8; depth++) {
    const link = current;
    if (code === void 0 && typeof link.code === "number") code = link.code;
    if (data === void 0 && link.data !== void 0) data = link.data;
    if (detail === void 0 && typeof link.shortMessage === "string") detail = link.shortMessage;
    current = link.cause;
  }
  const kind = code === void 0 ? void 0 : QUERY_ERROR_KINDS[code];
  if (kind === void 0 || code === void 0) return void 0;
  return new QueryError(kind, code, query2, data, detail);
}
var logger = getLogger("query:engine");
var MAX_LIMIT = 200;
async function runQuery(client, request) {
  const { query: query2, select, limit, cursor, atBlock } = request;
  if (limit !== void 0) {
    if (!Number.isInteger(limit) || limit < 1) throw new Error(`limit must be a positive integer, got ${limit}.`);
    if (limit > MAX_LIMIT) throw new Error(`limit ${limit} exceeds the node maximum of ${MAX_LIMIT}. Page through the results with the cursor instead.`);
  }
  const queryOptions = {
    select,
    ...atBlock !== void 0 && { atBlock: numberToHex(atBlock) },
    ...limit !== void 0 && { limit: numberToHex(limit) },
    ...cursor !== void 0 && { cursor }
  };
  logger("arkiv_query %s %o", query2, queryOptions);
  const result = await client.request({
    method: "arkiv_query",
    params: [query2, queryOptions]
  }).catch((error) => {
    throw asQueryError(error, query2) ?? error;
  });
  logger("Raw result from query %o", result);
  return {
    entities: result.data.map((rpcEntity) => entityFromRpcResult(rpcEntity)),
    blockNumber: BigInt(result.blockNumber),
    cursor: result.cursor
  };
}
var QUERYABLE_SYSTEM_ATTRIBUTES = {
  $key: "key",
  $owner: "addr",
  $creator: "addr",
  $expiresAt: "u64"
};
var RESULT_ONLY_SYSTEM_ATTRIBUTES = [
  "$createdAt",
  "$updatedAt",
  "$creationFlags",
  "$contentType",
  "$payload"
];
var ORDERED_TAGS = /* @__PURE__ */ new Set([
  "i32",
  "u64",
  "u256",
  "dec"
]);
var RANGE_OPERATORS = /* @__PURE__ */ new Set([
  "<",
  "<=",
  ">",
  ">="
]);
function resolveReference(name) {
  if (typeof name !== "string" || !name.startsWith("$")) {
    validateAttributeName(name);
    return;
  }
  const system = QUERYABLE_SYSTEM_ATTRIBUTES[name];
  if (system !== void 0) return system;
  if (RESULT_ONLY_SYSTEM_ATTRIBUTES.includes(name)) throw new InvalidPredicateError(`"${name}" is returned in query results but carries no index, so it cannot be filtered on. Select it and filter the results in JavaScript instead.`, name);
  throw new InvalidPredicateError(`"${name}" is not a system attribute. The queryable ones are ${Object.keys(QUERYABLE_SYSTEM_ATTRIBUTES).join(", ")}. "$" is reserved for these, so a user attribute cannot be named this.`, name);
}
function node(value) {
  Object.defineProperty(value, "toString", {
    value: () => render(value),
    enumerable: false
  });
  return Object.freeze(value);
}
function comparison(name, operator, input2) {
  const system = resolveReference(name);
  const value = toValue(input2, name);
  if (system !== void 0 && value.type !== system) throw new InvalidPredicateError(`"${name}" is a ${system}, but the value is a ${value.type}. System attributes have a fixed type \u2014 write ${system}(...) around the value.`, name);
  if (RANGE_OPERATORS.has(operator) && !ORDERED_TAGS.has(value.type)) throw new UnsupportedOperatorError(name, operator, value.type, `Only i32, u64, u256 and dec carry an ordered index; ${value.type} is equality-only.`);
  return node({
    kind: "comparison",
    name,
    operator,
    value
  });
}
function eq(name, value) {
  return comparison(name, "=", value);
}
function and(...expressions) {
  return combine("and", expressions.flat());
}
function combine(kind, expressions) {
  if (expressions.length === 0) throw new InvalidPredicateError(`${kind}() needs at least one expression. An empty ${kind === "and" ? "conjunction" : "disjunction"} has no query-language spelling \u2014 leave the ${kind}() out, or omit the filter entirely to match everything.`);
  const only = expressions[0];
  if (expressions.length === 1 && only !== void 0) return only;
  return node(kind === "and" ? {
    kind: "and",
    expressions: Object.freeze(expressions)
  } : {
    kind: "or",
    expressions: Object.freeze(expressions)
  });
}
var PRECEDENCE = {
  or: 1,
  and: 2,
  not: 3,
  leaf: 4
};
function precedenceOf(expression) {
  switch (expression.kind) {
    case "or":
      return PRECEDENCE.or;
    case "and":
      return PRECEDENCE.and;
    case "not":
      return PRECEDENCE.not;
    default:
      return PRECEDENCE.leaf;
  }
}
function nested(expression, minimum) {
  const rendered = render(expression);
  return precedenceOf(expression) < minimum ? `(${rendered})` : rendered;
}
function render(expression) {
  switch (expression.kind) {
    case "comparison":
      return `${expression.name} ${expression.operator} ${renderLiteral(expression.value)}`;
    case "startsWith":
      return `${expression.name} STARTSWITH ${renderLiteral(expression.value)}`;
    case "exists":
      return `EXISTS(${expression.name})`;
    case "typeOf":
      return `TYPEOF(${expression.name}) = ${expression.tag}`;
    case "not":
      return `NOT ${nested(expression.expression, PRECEDENCE.not)}`;
    case "and":
      return expression.expressions.map((sub) => nested(sub, PRECEDENCE.and)).join(" AND ");
    case "or":
      return expression.expressions.map((sub) => nested(sub, PRECEDENCE.or)).join(" OR ");
  }
}
function renderLiteral(value) {
  switch (value.type) {
    case "bool":
      return value.value ? "true" : "false";
    case "i32":
      return `i32(${value.value})`;
    case "u64":
      return `u64(${value.value})`;
    case "u256":
      return `u256(${value.value})`;
    case "dec":
      return `dec(${value.value})`;
    case "bytes32":
      return `bytes32(${value.value})`;
    case "key":
      return `key(${value.value})`;
    case "addr":
      return `addr(${value.value})`;
    case "str":
      return `str('${value.value.replaceAll("'", "''")}')`;
  }
}
var SELECTION_KEYS = [
  "key",
  "owner",
  "creator",
  "createdAt",
  "updatedAt",
  "expiresAt",
  "creationFlags",
  "contentType",
  "payload",
  "attributeSchema",
  "attributes"
];
function toRpcSelect(selection) {
  if (selection === void 0 || selection === "*") return Object.fromEntries(SELECTION_KEYS.map((field) => [field, true]));
  const select = {};
  let any = false;
  for (const field of SELECTION_KEYS) {
    const value = selection[field];
    if (field === "attributes" && typeof value === "object" && value !== null) {
      const names = Object.entries(value).filter(([, wanted]) => wanted);
      for (const [name] of names) validateAttributeName(name);
      select.attributes = names.length > 0 ? Object.fromEntries(names) : false;
      any ||= names.length > 0;
      continue;
    }
    select[field] = value === true;
    any ||= value === true;
  }
  if (!any) throw new Error('select() requires at least one field to be selected. Pass select() or select("*") to select everything.');
  return select;
}
var QueryResult = class {
  /** The entities on this page. */
  entities;
  /**
  * The block this page was read at.
  *
  * Every page of one walk reads the same block — the cursor is bound to it — so results cannot
  * shift under a paginating reader.
  */
  blockNumber;
  /** The cursor for the next page, or `undefined` when this was the last one. */
  cursor;
  fetchPage;
  constructor(entities, blockNumber, cursor, fetchPage$1) {
    this.entities = entities;
    this.blockNumber = blockNumber;
    this.cursor = cursor;
    this.fetchPage = fetchPage$1;
  }
  /**
  * Whether another page follows.
  *
  * The node omits the cursor once nothing remains, so this is an answer rather than the guess a
  * short final page would be — a full last page is reported correctly.
  */
  hasNextPage() {
    return this.cursor !== void 0;
  }
  /**
  * Fetches the next page.
  *
  * @throws {NoMoreResultsError} If this was the last page — check {@link hasNextPage} first.
  * @throws {QueryError} If the node rejects the request; `kind === "cursor"` means the cursor
  * expired and the walk has to start again.
  */
  async next() {
    if (this.cursor === void 0) throw new NoMoreResultsError();
    return this.fetchPage(this.cursor);
  }
};
var SelectQueryBuilder = class {
  _client;
  _select;
  _filters = [];
  _ownedBy;
  _createdBy;
  _limit;
  _cursor;
  _atBlock;
  constructor(client, selection) {
    this._client = client;
    this._select = toRpcSelect(selection);
  }
  where(...expressions) {
    this._filters.push(...expressions.flat());
    return this;
  }
  /**
  * Restricts the results to entities this account owns — shorthand for
  * `where(eq("$owner", addr(owner)))`. Calling it again replaces the filter.
  *
  * @example
  * builder.ownedBy("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
  */
  ownedBy(owner) {
    this._ownedBy = eq("$owner", addr(owner));
    return this;
  }
  /**
  * Restricts the results to entities this account created — shorthand for
  * `where(eq("$creator", addr(creator)))`. Calling it again replaces the filter.
  *
  * The creator never changes; the owner does, so these differ after a transfer.
  */
  createdBy(creator) {
    this._createdBy = eq("$creator", addr(creator));
    return this;
  }
  /**
  * Sets the page size, up to the node maximum of 200. Without it the node picks the page size.
  *
  * @example
  * builder.limit(100)
  */
  limit(limit) {
    this._limit = limit;
    return this;
  }
  /**
  * Starts from a cursor returned by an earlier page.
  *
  * Pagination normally goes through {@link QueryResult.next}, which carries the cursor for you;
  * this is for resuming a walk in a later process. A cursor is bound to the query, block and
  * selection it came from, so it must be used with an identically-built query.
  */
  cursor(cursor) {
    this._cursor = cursor;
    return this;
  }
  /**
  * Reads the state as of a given block rather than the head. The block must be within the range
  * the node retains.
  *
  * @example
  * builder.atBlock(1_297_000n)
  */
  atBlock(block) {
    this._atBlock = block;
    return this;
  }
  /**
  * The query string this builder will send — the same text the node parses.
  *
  * @throws {InvalidPredicateError} If no filter has been added.
  */
  toString() {
    const filters = [...this._filters];
    if (this._ownedBy) filters.push(this._ownedBy);
    if (this._createdBy) filters.push(this._createdBy);
    if (filters.length === 0) throw new InvalidPredicateError(`A query needs at least one filter \u2014 the language has no spelling for 'match every entity". Add a where(...) predicate, or narrow by ownedBy(...) / createdBy(...).`);
    return and(filters).toString();
  }
  /**
  * Runs the query and returns the first page.
  *
  * @throws {InvalidPredicateError} If no filter has been added.
  * @throws {QueryError} If the node rejects the query.
  *
  * @example
  * const page = await client.select({ key: true }).where(eq("category", "docs")).fetch()
  * page.entities        // this page
  * await page.next()    // the next one
  */
  async fetch() {
    const request = Object.freeze({
      query: this.toString(),
      select: this._select,
      limit: this._limit,
      atBlock: this._atBlock
    });
    return fetchPage(this._client, request, this._cursor);
  }
  /**
  * Walks every page, yielding one entity at a time.
  *
  * @example
  * for await (const entity of client.select({ key: true }).where(eq("category", "docs"))) {
  *   console.log(entity.key)
  * }
  */
  async *[Symbol.asyncIterator]() {
    let page = await this.fetch();
    while (page) {
      yield* page.entities;
      page = page.hasNextPage() ? await page.next() : void 0;
    }
  }
};
async function fetchPage(client, request, cursor) {
  const response = await runQuery(client, {
    ...request,
    cursor
  });
  return new QueryResult(response.entities, response.blockNumber, response.cursor, (next) => fetchPage(client, request, next));
}

// ../node_modules/@arkiv-network/sdk/dist/expiry-Cgdb_dbq.js
var ARKIV_ADDRESS = "0x4400000000000000000000000000000000000044";
var BLOCK_TIME = 2;
var MAX_EXPIRES_AT = 2n ** 64n - 1n;
var OperationType = {
  Create: 1,
  Patch: 2,
  ExtendExpiry: 3,
  TransferOwnership: 4,
  Delete: 5
};

// ../node_modules/@arkiv-network/sdk/dist/entity-CniBgBSd.js
var MAX_SALT = 2n ** 128n - 1n;
var NO_SALT = /* @__PURE__ */ Symbol("NO_SALT");
function randomSalt() {
  const source = globalThis.crypto;
  if (typeof source?.getRandomValues !== "function") throw new NoRandomSourceError();
  const bytes = source.getRandomValues(new Uint8Array(16));
  let salt = 0n;
  for (const byte of bytes) salt = salt << 8n | BigInt(byte);
  return salt;
}
function resolveSalt(salt) {
  return salt === NO_SALT ? 0n : validateSalt(salt);
}
function validateSalt(salt) {
  if (typeof salt !== "bigint" || salt < 0n || salt > MAX_SALT) throw new InvalidSaltError(salt);
  return salt;
}
function predictEntityKey({ owner, nonce, salt, chainId }) {
  return keccak256(encodePacked([
    "uint256",
    "address",
    "address",
    "uint64",
    "uint128"
  ], [
    BigInt(chainId),
    ARKIV_ADDRESS,
    owner,
    nonce,
    resolveSalt(salt)
  ]));
}
var ENTITY_EVENTS_ABI = parseAbi([
  "event EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags)",
  "event EntityPatched(bytes32 indexed entityKey, address indexed owner)",
  "event ExpiryExtended(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt)",
  "event OwnershipTransferred(bytes32 indexed entityKey, address indexed previousOwner, address indexed newOwner)",
  "event EntityDeleted(bytes32 indexed entityKey, address indexed owner)"
]);

// ../node_modules/@arkiv-network/sdk/dist/index.js
var logger$9 = getLogger("actions:public:get-block-timing");
async function getBlockTiming(client) {
  const blockTiming = await client.request({
    method: "arkiv_getBlockTiming",
    params: []
  });
  logger$9("Block timing %o", blockTiming);
  return {
    currentBlock: BigInt(blockTiming.current_block),
    currentBlockTime: blockTiming.current_block_time,
    blockDuration: blockTiming.duration
  };
}
async function getEntity(client, entityKey) {
  const { entities } = await runQuery(client, {
    query: eq("$key", key(entityKey)).toString(),
    select: toRpcSelect("*"),
    limit: 1
  });
  const entity = entities[0];
  if (entity === void 0) throw new NoEntityFoundError(entityKey);
  return entity;
}
async function getEntityCount(client) {
  return await client.request({
    method: "arkiv_getEntityCount",
    params: []
  });
}
var EXECUTE_ABI = parseAbi(["function execute((uint8 operation, bytes operationData)[] ops) external returns (bytes32[] keys)"]);
var ENTITY_NONCE_ABI = parseAbi(["function entityNonce(address owner) external view returns (uint64)"]);
var ATTRIBUTE_TUPLE = "(bytes32 name, uint8 typeId, bytes value)[]";
var PAYLOAD_PARAMS = {
  [OperationType.Create]: parseAbiParameters(`(uint128 salt, uint64 expiresAt, uint64 minLifetime, uint8 creationFlags, ${ATTRIBUTE_TUPLE} attributes)`),
  [OperationType.Patch]: parseAbiParameters(`(bytes32 entityKey, ${ATTRIBUTE_TUPLE} mutations)`),
  [OperationType.ExtendExpiry]: parseAbiParameters("(bytes32 entityKey, uint64 expiresAt, uint64 minLifetime)"),
  [OperationType.TransferOwnership]: parseAbiParameters("(bytes32 entityKey, address newOwner)"),
  [OperationType.Delete]: parseAbiParameters("(bytes32 entityKey)")
};
var logger$8 = getLogger("actions:public:get-entity-nonce");
async function getEntityNonce(client, owner) {
  const nonce = await readContract(client, {
    address: ARKIV_ADDRESS,
    abi: ENTITY_NONCE_ABI,
    functionName: "entityNonce",
    args: [owner]
  });
  logger$8("entity nonce of %s is %s", owner, nonce);
  return nonce;
}
async function predictEntityKeys(client, { owner, count, salts }) {
  const resolvedSalts = resolveSalts(count, salts);
  const chainId = client.chain?.id ?? await getChainId(client);
  const nonce = await getEntityNonce(client, owner);
  return resolvedSalts.map((salt, index2) => ({
    key: predictEntityKey({
      owner,
      nonce: nonce + BigInt(index2),
      salt,
      chainId
    }),
    salt
  }));
}
function resolveSalts(count, salts) {
  if (salts !== void 0) {
    if (salts.length === 0) throw new Error("predictEntityKeys: `salts` is empty \u2014 there is nothing to predict");
    return salts.map(resolveSalt);
  }
  if (count === void 0) throw new Error("predictEntityKeys: pass either `count` or `salts`");
  if (!Number.isInteger(count) || count <= 0) throw new Error(`predictEntityKeys: \`count\` must be a positive whole number, got ${count}`);
  return Array.from({ length: count }, () => randomSalt());
}
function query(client, query$1, options = {}) {
  return runQuery(client, {
    query: query$1.toString(),
    select: toRpcSelect(options.select),
    limit: options.limit,
    cursor: options.cursor,
    atBlock: options.atBlock
  });
}
var logger$7 = getLogger("actions:public:watch-entity-events");
var DEFAULT_POLLING_INTERVAL = BLOCK_TIME * 1e3 / 2;
function watchEntityEvents(client, parameters) {
  const { onEntityCreated, onEntityPatched, onExpiryExtended, onOwnershipTransferred, onEntityDeleted, onEvent, onError, fromBlock, pollingInterval = DEFAULT_POLLING_INTERVAL } = parameters;
  const publicClient2 = client;
  const reportError = onError ?? logToConsole;
  function emit(event) {
    deliver(onEvent, event);
    switch (event.type) {
      case "EntityCreated":
        deliver(onEntityCreated, event);
        break;
      case "EntityPatched":
        deliver(onEntityPatched, event);
        break;
      case "ExpiryExtended":
        deliver(onExpiryExtended, event);
        break;
      case "OwnershipTransferred":
        deliver(onOwnershipTransferred, event);
        break;
      case "EntityDeleted":
        deliver(onEntityDeleted, event);
        break;
    }
  }
  function deliver(handler, event) {
    if (handler === void 0) return;
    try {
      handler(event);
    } catch (error) {
      reportError(asError(error));
    }
  }
  return publicClient2.watchEvent({
    address: ARKIV_ADDRESS,
    events: ENTITY_EVENTS_ABI,
    pollingInterval,
    ...fromBlock !== void 0 && { fromBlock },
    onLogs: (logs) => {
      logger$7("logs %o", logs);
      for (const log of logs) {
        if (log.blockNumber === null || log.transactionHash === null || log.logIndex === null) continue;
        const context = {
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex
        };
        let event;
        try {
          event = toEntityEvent(log.topics, log.data, context);
        } catch (error) {
          reportError(asError(error));
          continue;
        }
        emit(event);
      }
    },
    onError: (error) => reportError(error)
  });
}
function logToConsole(error) {
  console.error("watchEntityEvents error", error);
}
function asError(error) {
  return error instanceof Error ? error : new Error(String(error));
}
function toEntityEvent(topics, data, context) {
  const decoded = decodeEventLog({
    abi: ENTITY_EVENTS_ABI,
    topics,
    data
  });
  switch (decoded.eventName) {
    case "EntityCreated":
      return {
        type: "EntityCreated",
        ...context,
        ...decoded.args,
        creationFlags: decodeCreationFlags(decoded.args.creationFlags)
      };
    case "EntityPatched":
      return {
        type: "EntityPatched",
        ...context,
        ...decoded.args
      };
    case "ExpiryExtended":
      return {
        type: "ExpiryExtended",
        ...context,
        ...decoded.args
      };
    case "OwnershipTransferred":
      return {
        type: "OwnershipTransferred",
        ...context,
        ...decoded.args
      };
    case "EntityDeleted":
      return {
        type: "EntityDeleted",
        ...context,
        ...decoded.args
      };
  }
}
function publicArkivActions(client) {
  return {
    getEntity: (key$1) => getEntity(client, key$1),
    query: (rawQuery, queryOptions) => query(client, rawQuery, queryOptions),
    select: (selection) => new SelectQueryBuilder(client, selection),
    getBlockTiming: () => getBlockTiming(client),
    getEntityCount: () => getEntityCount(client),
    getEntityNonce: (owner) => getEntityNonce(client, owner),
    predictEntityKeys: (parameters) => predictEntityKeys(client, parameters),
    watchEntityEvents: (parameters) => watchEntityEvents(client, parameters)
  };
}
function createPublicClient(parameters) {
  const { key: key$1 = "public", name = "Public Client" } = parameters;
  return createClient({
    ...parameters,
    key: key$1,
    name
  }).extend(publicActions).extend(publicArkivActions);
}
var logger$6 = getLogger("utils:arkiv-transactions");
var ENTITY_ERRORS_ABI = parseAbi([
  "error EmptyBatch()",
  "error InvalidOpType(uint8 operation)",
  "error NonCanonicalOperationData(uint8 operation)",
  "error AttributesNotSorted()",
  "error TooManyAttributes(uint256 count, uint256 maxCount)",
  "error EmptyMutations(bytes32 entityKey)",
  "error TombstoneInCreate(bytes32 name)",
  "error TombstoneValueNotEmpty(bytes32 name)",
  "error SystemAttributeNotWritable(bytes32 name)",
  "error InvalidValueType(bytes32 name, uint8 typeId)",
  "error Ident32Empty()",
  "error Ident32InvalidByte(uint256 position, bytes1 value)",
  "error EntityNotFound(bytes32 entityKey)",
  "error EntityExpired(bytes32 entityKey, uint64 expiresAt)",
  "error NotOwner(bytes32 entityKey, address caller, address owner)",
  "error ReadOnlyEntity(bytes32 entityKey)",
  "error ReservedCreationFlags(uint8 creationFlags)",
  "error ExpiryDeadOnArrival(uint64 target, uint64 currentBlock)",
  "error ExpiryNotExtended(bytes32 entityKey, uint64 newExpiresAt, uint64 currentExpiresAt)",
  "error TransferToZeroAddress(bytes32 entityKey)",
  "error TransferToSelf(bytes32 entityKey)"
]);
var EXECUTE_ABI$1 = [...EXECUTE_ABI, ...ENTITY_ERRORS_ABI];
var logger$5 = getLogger("actions:wallet:change-ownership");
var logger$4 = getLogger("actions:wallet:create-entity");
var logger$3 = getLogger("actions:wallet:delete-entity");
var logger$2 = getLogger("actions:wallet:execute-batch");
var logger$12 = getLogger("actions:wallet:extend-entity");
var logger2 = getLogger("actions:wallet:patch-entity");
var chainMap = new Map(Object.entries(chains_exports).map(([key$1, value]) => [key$1.toLowerCase(), value]));

// ../packages/sdk/src/arkiv.ts
var RETRY = { retryCount: 6, retryDelay: 400 };
function publicClient(opts = {}) {
  const transport = opts.ws ? webSocket(opts.rpcUrl ?? TIRAMISU.wsUrl, RETRY) : http(opts.rpcUrl ?? TIRAMISU.rpcUrl, RETRY);
  return createPublicClient({ chain: tiramisu, transport });
}
var PAGE = 200;
function attestationQuery(pub, issuer) {
  return pub.select("*").where(and(eq("project", PROJECT), eq("type", "attestation"))).createdBy(issuer).limit(PAGE);
}
function advisoryQuery(pub, issuer) {
  return pub.select("*").where(and(eq("project", PROJECT), eq("type", "advisory"))).createdBy(issuer).limit(PAGE);
}
function attr(e, name) {
  return e.attributes?.[name]?.value;
}
function toAttestationRecord(e) {
  const verdict = attr(e, "verdict");
  const advisory = attr(e, "advisory");
  if (!e.key || !e.creator || verdict !== "confirm" && verdict !== "withdraw") return null;
  if (typeof advisory !== "string") return null;
  let reason;
  try {
    const p = e.toJson?.();
    if (p && typeof p.reason === "string") reason = p.reason;
  } catch {
  }
  return {
    key: e.key.toLowerCase(),
    advisory: advisory.toLowerCase(),
    issuer: e.creator.toLowerCase(),
    verdict,
    createdAt: Number(e.createdAt ?? 0n),
    attestedAt: Number(attr(e, "attested_at") ?? 0n),
    reason
  };
}
async function readAttestations(pub, issuers) {
  const out = [];
  let blockNumber = 0n;
  for (const issuer of issuers) {
    let page = await attestationQuery(pub, issuer).fetch();
    for (; ; ) {
      if (page.blockNumber > blockNumber) blockNumber = page.blockNumber;
      for (const e of page.entities) {
        const r = toAttestationRecord(e);
        if (r) out.push(r);
      }
      if (!page.hasNextPage()) break;
      page = await page.next();
    }
  }
  return { attestations: out, blockNumber };
}
var InvalidAdvisoryError = class extends Error {
};
function toAdvisoryRecord(e) {
  if (!e.key || !e.creator || !e.owner) throw new InvalidAdvisoryError("entity is missing metadata");
  if (attr(e, "project") !== PROJECT || attr(e, "type") !== "advisory") {
    throw new InvalidAdvisoryError("entity is not a mene-v1 advisory");
  }
  if (!e.creationFlags?.readonly) throw new InvalidAdvisoryError("advisory is not readonly");
  let osv;
  try {
    osv = parseOsv(e.toJson?.());
  } catch (err) {
    throw new InvalidAdvisoryError(`invalid OSV payload: ${err.message}`);
  }
  return {
    key: e.key.toLowerCase(),
    creator: e.creator.toLowerCase(),
    owner: e.owner.toLowerCase(),
    createdAt: Number(e.createdAt ?? 0n),
    expiresAt: Number(e.expiresAt ?? 0n),
    readonly: e.creationFlags.readonly,
    permissionlessExtension: e.creationFlags.permissionlessExtension,
    osv
  };
}
async function readAdvisory(pub, key2) {
  try {
    const e = await pub.getEntity(key2);
    return toAdvisoryRecord(e);
  } catch (err) {
    if (err instanceof NoEntityFoundError) return null;
    throw err;
  }
}
var READ_CONCURRENCY = 4;
async function readLive(pub, issuers) {
  const { attestations, blockNumber } = await readAttestations(pub, issuers);
  const keys = new Set(attestations.map((a) => a.advisory));
  const advisories = {};
  const invalid = {};
  const add = (k, read) => {
    try {
      advisories[k] = read();
    } catch (err) {
      if (err instanceof InvalidAdvisoryError) invalid[k] = err.message;
      else throw err;
    }
  };
  for (const issuer of issuers) {
    let page = await advisoryQuery(pub, issuer).fetch();
    for (; ; ) {
      for (const entity of page.entities) {
        const e = entity;
        const k = e.key?.toLowerCase();
        if (k && keys.has(k) && !(k in advisories)) add(k, () => toAdvisoryRecord(e));
      }
      if (!page.hasNextPage()) break;
      page = await page.next();
    }
  }
  const missing = [...keys].filter((k) => !(k in advisories) && !(k in invalid));
  let next = 0;
  const worker = async () => {
    while (next < missing.length) {
      const k = missing[next++];
      try {
        const a = await readAdvisory(pub, k);
        if (a) advisories[k] = a;
      } catch (err) {
        if (err instanceof InvalidAdvisoryError) invalid[k] = err.message;
        else throw err;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(READ_CONCURRENCY, missing.length) }, worker));
  return { attestations, advisories, invalid, blockNumber };
}

// ../packages/sdk/src/mirror.ts
var import_semver3 = __toESM(require_semver2(), 1);
var CURATED = [
  ["chalk", "5.6.1"],
  ["debug", "4.4.2"],
  ["ansi-styles", "6.2.2"],
  ["supports-color", "10.2.1"],
  ["strip-ansi", "7.1.1"],
  ["ansi-regex", "6.2.1"],
  ["wrap-ansi", "9.0.1"],
  ["color-convert", "3.1.1"],
  ["color-name", "2.0.1"],
  ["is-arrayish", "0.3.3"],
  ["slice-ansi", "7.1.1"],
  ["color", "5.0.1"],
  ["color-string", "2.1.1"],
  ["simple-swizzle", "0.2.3"],
  ["supports-hyperlinks", "4.1.1"],
  ["has-ansi", "6.0.1"],
  ["chalk-template", "1.1.1"],
  ["backslash", "0.2.1"],
  ["error-ex", "1.3.3"]
].map(([name, version]) => ({ name, version, incident: "qix-2025-09-08" }));

// ../packages/cli/src/check.ts
import { readFileSync as readFileSync2 } from "fs";

// ../packages/cli/src/config.ts
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import { homedir } from "os";
import { dirname, join, resolve } from "path";

// ../packages/cli/src/witnesses.ts
var DEMO_WITNESSES = [
  {
    name: "Witness A",
    address: "0x9bEBE1512c9f4E9F04B7DC45824b116985013238"
  },
  {
    name: "Witness B",
    address: "0x15d88D1614BAE54b8306AF59D829E653F473A112"
  },
  {
    name: "Witness C",
    address: "0xf3D23647131f4c5002b6b60C137b69222512f771"
  }
];

// ../packages/cli/src/config.ts
var ADDRESS = /^0x[0-9a-fA-F]{40}$/;
function loadConfig(path, overrides = {}) {
  const file = path ? resolve(path) : resolve("mene.config.json");
  let raw = {};
  if (existsSync(file)) raw = JSON.parse(readFileSync(file, "utf8"));
  else if (path) throw new Error(`config file not found: ${path}`);
  for (const [k, v] of Object.entries(overrides)) if (v !== void 0) raw[k] = v;
  let issuers = raw.issuers?.length ? raw.issuers : void 0;
  if (!issuers && process.env.MENE_ISSUERS) issuers = process.env.MENE_ISSUERS.split(/[\s,]+/).filter(Boolean);
  issuers ??= DEMO_WITNESSES.map((w) => w.address);
  for (const i of issuers) if (!ADDRESS.test(i)) throw new Error(`invalid issuer address: ${i}`);
  const threshold = Number(raw.threshold ?? process.env.MENE_THRESHOLD ?? DEFAULT_THRESHOLD);
  if (!Number.isInteger(threshold) || threshold < 1) throw new Error("threshold must be a positive integer");
  if (issuers.length > 0 && threshold > issuers.length) throw new Error("threshold exceeds the number of issuers");
  const minSeverity = normalizeSeverity(raw.minSeverity ?? "low");
  if (!minSeverity) throw new Error(`invalid minSeverity: ${raw.minSeverity} (use low, moderate, high or critical)`);
  return { issuers, threshold, minSeverity, rpcUrl: raw.rpcUrl ?? process.env.MENE_RPC_URL };
}
function cachePath() {
  const dir = process.env.MENE_CACHE_DIR ?? join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "mene");
  return join(dir, "state.json");
}
function loadState() {
  const p = cachePath();
  if (!existsSync(p)) return void 0;
  let s;
  try {
    s = JSON.parse(readFileSync(p, "utf8"));
  } catch {
    throw new Error(`cache ${p} is corrupt; inspect or delete it deliberately (fail closed)`);
  }
  const migrated = migrateState(s);
  if (!migrated)
    throw new Error(
      `cache ${p} is malformed or from an unknown version; inspect or delete it deliberately (fail closed)`
    );
  return migrated;
}
function saveState(s) {
  const p = cachePath();
  mkdirSync(dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(s, null, 2));
  renameSync(tmp, p);
}

// ../packages/cli/src/check.ts
async function loadStatuses(cfg, opts = {}) {
  const warnings = [];
  const state = loadState();
  if (cfg.issuers.length === 0) throw new Error("no trusted issuers configured (mene.config.json or MENE_ISSUERS)");
  if (!opts.offline) {
    try {
      const live = await readLive(publicClient({ rpcUrl: cfg.rpcUrl }), cfg.issuers);
      for (const [k, why] of Object.entries(live.invalid)) warnings.push(`ignored invalid advisory ${k}: ${why}`);
      const out2 = resolveStatus({
        issuers: cfg.issuers,
        threshold: cfg.threshold,
        liveAttestations: live.attestations,
        liveAdvisories: live.advisories,
        state
      });
      saveState(out2.state);
      return { statuses: out2.statuses, source: "live", warnings, blockNumber: live.blockNumber };
    } catch (err) {
      if (!state) throw new Error(`cannot reach Arkiv and no cache exists (fail closed): ${err.message}`);
      warnings.push(`cannot reach Arkiv, using cache: ${err.message}`);
    }
  }
  if (!state) throw new Error("--offline needs a cache; run `mene check` online once (fail closed)");
  const out = resolveStatus({
    issuers: cfg.issuers,
    threshold: cfg.threshold,
    liveAttestations: Object.values(state.attestations),
    liveAdvisories: state.advisories,
    state
  });
  return { statuses: out.statuses, source: "cache", warnings };
}
async function runCheck(cfg, lockfilePath, opts = {}) {
  const installed = parseLockfile(readFileSync2(lockfilePath, "utf8"));
  const loaded = await loadStatuses(cfg, opts);
  const enforced = loaded.statuses.filter((s) => s.enforced).flatMap((s) => {
    if (!s.advisory) {
      loaded.warnings.push(
        `advisory ${s.key} is ${s.label} but its content was never cached; read it from chain history`
      );
      return [];
    }
    return [{ key: s.key, status: s.label, advisory: s.advisory.osv }];
  });
  const matches = matchLockfile(installed, enforced, opts.minSeverity ?? cfg.minSeverity);
  return { ...loaded, matches };
}
function matchTable(matches) {
  const rows = [
    "| Package | Installed | Safe version | Severity | Advisory | Status |",
    "|---|---|---|---|---|---|",
    ...matches.map(
      (m) => `| \`${m.package}\` | \`${m.installed}\` | ${m.safeVersion ? `\`${m.safeVersion}\`` : "\u2014"} | ${m.severity} | ${m.advisoryId} | ${m.status} |`
    )
  ];
  return rows.join("\n");
}

// src/index.ts
var input = (name) => (process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] ?? "").trim();
var summary = (md) => process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}
`);
var output = (k, v) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}
`);
async function main() {
  process.env.MENE_CACHE_DIR ??= `${process.env.RUNNER_TEMP ?? "/tmp"}/mene-cache`;
  const sevInput = input("min-severity");
  const sev = sevInput ? normalizeSeverity(sevInput) : void 0;
  if (sevInput && !sev) throw new Error(`invalid min-severity ${sevInput} (use low, moderate, high or critical)`);
  const lockfile = input("lockfile") || "package-lock.json";
  const cfg = loadConfig(void 0, {
    issuers: input("issuers") ? input("issuers").split(/[\s,]+/).filter(Boolean) : void 0,
    threshold: input("threshold") ? Number(input("threshold")) : void 0,
    minSeverity: sev,
    rpcUrl: input("rpc-url") || void 0
  });
  const r = await runCheck(cfg, lockfile);
  for (const w of r.warnings) console.log(`::warning::${w}`);
  output("matches", String(r.matches.length));
  const head = `### Mene \xB7 \`${lockfile}\`
${r.statuses.length} advisories, ${r.statuses.filter((s) => s.enforced).length} enforced \xB7 quorum ${cfg.threshold}/${cfg.issuers.length} \xB7 source: ${r.source}${r.blockNumber ? ` @ block ${r.blockNumber}` : ""}
`;
  if (r.matches.length === 0) {
    summary(`${head}
\u2705 **Clean** \u2014 no enforced advisory matches this lockfile.`);
    console.log("Mene: clean");
    return;
  }
  summary(`${head}
\u274C **${r.matches.length} hijacked package(s)**

${matchTable(r.matches)}`);
  for (const m of r.matches) {
    console.log(
      `::error file=${lockfile}::${m.package}@${m.installed} is flagged by ${m.advisoryId} (${m.status})${m.safeVersion ? `; use ${m.safeVersion}` : ""}`
    );
  }
  process.exitCode = 1;
}
main().catch((err) => {
  console.log(`::error::Mene failed closed: ${err.message.split("\n")[0]}`);
  summary(`### Mene
\u26A0\uFE0F **Failed closed**: ${err.message.split("\n")[0]}`);
  process.exitCode = 2;
});
