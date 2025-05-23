/*****************************************************************************************
 *                                                                                       *
 * OpenSpace-api-js                                                                      *
 *                                                                                       *
 * Copyright (c) 2024-2024                                                               *
 *                                                                                       *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this  *
 * software and associated documentation files (the "Software"), to deal in the Software *
 * without restriction, including without limitation the rights to use, copy, modify,    *
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to    *
 * permit persons to whom the Software is furnished to do so, subject to the following   *
 * conditions:                                                                           *
 *                                                                                       *
 * The above copyright notice and this permission notice shall be included in all copies *
 * or substantial portions of the Software.                                              *
 *                                                                                       *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,   *
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A         *
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT    *
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  *
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE  *
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                         *
 ****************************************************************************************/

declare module 'openspace-api-js' {
  export class OpenSpaceApi {
    /**
     * Construct an instance of the OpenSpace API.
     * @param socket An instance of Socket or WebSocket.
     *               The socket should not be connected prior to calling this constructor.
     */
    constructor(socket: SocketWrapper | WebSocketWrapper);

    /**
     * Set connect callback.
     * @param callback The function to execute when connection is established.
     */
    onConnect(callback: () => void): void;

    /**
     * Set disconnect callback.
     * @param callback The function to execute when socket is disconnected.
     */
    onDisconnect(callback: () => void): void;

    /**
     * Connect to OpenSpace.
     */
    connect(): void;

    /**
     * Disconnect from OpenSpace.
     */
    disconnect(): void;

    /**
     * Initialize a new channel of communication
     * @param type A string specifying the type of topic to construct.
     *             See OpenSpace's server module for available topic types.
     * @param payload The JavaScript object to send. Must be possible to encode to JSON.
     *
     * @return An object representing the topic.
     */
    startTopic(type: string, payload: object): Topic;

    /**
     * Authenticate this client.
     * This must be done if the client is not whitelisted in openspace.cfg.
     * @param secret The secret used to authenticate with OpenSpace.
     *
     * @return An object promise whether user was succesfully authorized.
     */
    authenticate(secret: string): Promise<object>;

    /**
     * Set a property
     * @param property The URI of the property to set.
     * @param value - The value to set the property to.
     */
    setProperty(property: string, value: unknown): void;

    /**
     * Get a property
     * @param property The URI of the property to set.
     *
     * @return The value of the property.
     */
    getProperty(property: string): Promise<unknown>;

    /**
     * Get a documentation object
     * @param type The type of documentation to get.
     *              For available types, check documentationtopic.cpp in OpenSpace's
     *              server module.
     *
     * @return An object representing the requested documentation.
     */
    getDocumentation(type: string): Promise<object>;

    /**
     * Subscribe to a property
     * @param property The URI of the property.
     *
     * @return A topic object to represent the subscription topic.
     *         When cancelled, this object will unsubscribe to the property.
     */
    subscribeToProperty(property: string): Topic;

    /**
     * Execute a lua script
     * @param script The lua script to execute.
     * @param getReturnValue Specified whether the return value should be collected.
     * @param houldBeSynchronized Specified whether the script should be synchronized on a
     *                            cluster
     * @return The return value of the script, if `getReturnValue` is true, otherwise
     *         undefined.
     */
    executeLuaScript(
      script: string,
      getReturnValue: boolean,
      shouldBeSynchronized: boolean
    ): Promise<unknown | undefined>;

    /**
     * Execute a lua function from the OpenSpace library
     * @param function The lua function to execute (for example
     *                 `openspace.addSceneGraphNode`).
     * @param getReturnValue Specified whether the return value should be collected.
     *
     * @return The return value of the script, if `getReturnValue` is true, otherwise
     *         undefined.
     */
    executeLuaFunction(
      fun: string,
      getReturnValue: boolean
    ): Promise<unknown | undefined>;

    /**
     * Get an object representing the OpenSpace lua library.
     * @param MultiReturn Whether the library should return the raw lua tables.
     *                    If this value is true, the 1-indexed lua table will be returned
     *                    as a JavaScript object. If the value is false, then only the
     *                    first return value will be returned
     *
     * @return The lua library, mapped to async JavaScript functions.
     */
    library(multireturn?: boolean | undefined): Promise<OpenSpace.openspace>;

    /**
     * Get an object representing the OpenSpace lua library.
     * @return The lua library, mapped to async JavaScript functions.
     *         This method only returns the first return value.
     */
    singleReturnLibrary(): Promise<OpenSpace.openspace>;

    /**
     * Get an object representing the OpenSpace lua library.
     * @return The lua library, mapped to async JavaScript functions.
     *         The values returned by the async functions will be the entire lua tables,
     *         with 1-indexed values.
     */
    multiReturnLibrary(): Promise<OpenSpace.openspace>;
  }

  export class SocketWrapper {
    /** Internal usage only */
    constructor(address: string, port: number);
    onConnect(cb: () => void): void;
    onDisconnect(cb: () => void): void;
    onMessage(cb: (message: string) => void): void;
    connect(): void;
    send(message: any): void;
    disconnect(): void;
  }

  export class WebSocketWrapper {
    /** Internal usage only */
    constructor(address: string, port: number);
    onConnect(cb: () => void): void;
    onDisconnect(cb: () => void): void;
    onMessage(cb: (message: string) => void): void;
    connect(): void;
    send(message: any): void;
    disconnect(): void;
  }

  export class Topic {
    /** Internal usage only */
    constructor(
      iterator: AsyncGenerator<any, void, unknown>,
      talk: (payload: any) => void,
      cancel: () => void
    );
    /**
     * Send data within a topic
     * @param {object} data - The JavaScript object to send.
     *        Must be possible to encode into JSON.
     */
    talk(data: any): void;
    /**
     * Get the async iterator used to get data from OpenSpace.
     */
    iterator(): AsyncGenerator<any, void, unknown>;
    /**
     * Cancel the topic.
     */
    cancel(): void;
  }

  export default function (host: string, port: number): OpenSpaceApi;
} // module OpenSpaceApi

/* The following declarations are automatically generated from the OpenSpace lua library */
declare namespace OpenSpace {
type path = string;
type table = object;
type action = object;
type custompropertytype = any;
type integer = number;
type vec2 = [number, number];
type vec3 = [number, number, number];
type mat3x3 = { 1: number; 2: number; 3: number; 4: number; 5: number;6: number; 7: number; 8: number; 9: number; };
type translation = object;
type spicekernel = path;

export interface openspace {
  action: actionLibrary;
  asset: assetLibrary;
  audio: audioLibrary;
  dashboard: dashboardLibrary;
  debugging: debuggingLibrary;
  event: eventLibrary;
  exoplanets: exoplanetsLibrary;
  gaia: gaiaLibrary;
  globebrowsing: globebrowsingLibrary;
  iswa: iswaLibrary;
  keyframeRecording: keyframeRecordingLibrary;
  modules: modulesLibrary;
  navigation: navigationLibrary;
  openglCapabilities: openglCapabilitiesLibrary;
  orbitalnavigation: orbitalnavigationLibrary;
  parallel: parallelLibrary;
  pathnavigation: pathnavigationLibrary;
  scriptScheduler: scriptSchedulerLibrary;
  sessionRecording: sessionRecordingLibrary;
  skybrowser: skybrowserLibrary;
  sonification: sonificationLibrary;
  space: spaceLibrary;
  spice: spiceLibrary;
  statemachine: statemachineLibrary;
  sync: syncLibrary;
  systemCapabilities: systemCapabilitiesLibrary;
  telemetry: telemetryLibrary;
  time: timeLibrary;

  /**
   * Passes the argument to FileSystem::absolutePath, which resolves occuring path tokens and returns the absolute path.
   */
  absPath: (path: string) => Promise<path>
  /**
   * Creates a new property that lives in the `UserProperty` group.

\\param identifier The identifier that is going to be used for the new property \\param type The type of the property, has to be one of \"DMat2Property\", \"DMat3Property\", \"DMat4Property\", \"Mat2Property\", \"Mat3Property\", \"Mat4Property\", \"BoolProperty\", \"DoubleProperty\", \"FloatProperty\", \"IntProperty\", \"StringProperty\", \"StringListProperty\", \"LongProperty\", \"ShortProperty\", \"UIntProperty\", \"ULongProperty\", \"DVec2Property\", \"DVec3Property\", \"DVec4Property\", \"IVec2Property\", \"IVec3Property\", \"IVec4Property\", \"UVec2Property\", \"UVec3Property\", \"UVec4Property\", \"Vec2Property\", \"Vec3Property\", \"Vec4Property\" \\param guiName The name that the property uses in the user interface. If this value is not provided, the `identifier` is used instead \\param description A description what the property is used for \\param onChange A Lua script that will be executed whenever the property changes
   */
  addCustomProperty: (identifier: string, type: custompropertytype, guiName?: string, description?: string, onChange?: string) => Promise<void>
  /**
   * Loads the SceneGraphNode described in the table and adds it to the SceneGraph.
   */
  addSceneGraphNode: (node: table) => Promise<void>
  /**
   * / Will create a ScreenSpaceRenderable from a lua Table and add it in the RenderEngine
   */
  addScreenSpaceRenderable: (screenSpace: table) => Promise<void>
  /**
   * Adds a Tag to a SceneGraphNode identified by the provided uri
   */
  addTag: (uri: string, tag: string) => Promise<void>
  /**
   * Add a value to the property with the given identifier. Works on both
 numerical and string properties, where adding to a string property means appending
 the given string value to the existing string value.
   */
  addToPropertyValue: (identifier: string, value: string | number) => Promise<void>
  /**
   * Add a value to the list property with the given identifier. The
 value can be any type, as long as it is the correct type for the given property.
 Note that a number will be converted to a string automatically.
   */
  appendToListProperty: (identifier: string, value: any) => Promise<void>
  /**
   * Binds a key to Lua command to both execute locally and broadcast to all clients if this node is hosting a parallel connection.
   */
  bindKey: (key: string, action: string) => Promise<void>
  /**
   * Returns the bounding sphere of the scene graph node with the given string as identifier.
   */
  boundingSphere: (identifier: string) => Promise<number>
  /**
   * Unbinds the key or keys that have been provided. This function can be called with a single key or with an array of keys to remove all of the provided keys at once.
   */
  clearKey: (key: string | string[]) => Promise<void>
  /**
   * Clear all key bindings
   */
  clearKeys: () => Promise<void>
  /**
   * Returns the whole configuration object as a Dictionary
   */
  configuration: () => Promise<table>
  /**
   * Creates a directory at the provided path, returns true if directory was newly created and false otherwise. If `recursive` flag is set to true, it will automatically create any missing parent folder as well
   */
  createDirectory: (path: path, recursive?: boolean) => Promise<boolean>
  /**
   * Creates a 1 pixel image with a certain color in the cache folder and returns the path to the file. If a cached file with the given name already exists, the path to that file is returned. The first argument is the name of the file, without extension. The second is the RGB color, given as {r, g, b} with values between 0 and 1.
   */
  createSingleColorImage: (name: string, color: vec3) => Promise<path>
  /**
   * Checks whether the provided directory exists.
   */
  directoryExists: (file: path) => Promise<boolean>
  /**
   * This function extracts the directory part of the passed path. For example, if the parameter is 'C:\\\\OpenSpace\\\\foobar\\\\foo.txt', this function returns 'C:\\\\OpenSpace\\\\foobar'.
   */
  directoryForPath: (file: path) => Promise<path>
  /**
   * Downloads a file from Lua interpreter
   */
  downloadFile: (url: string, savePath: string, waitForCompletion?: boolean) => Promise<void>
  /**
   * Extracts the DPI scaling for either the GUI window or if there is no dedicated GUI window, the first window.
   */
  dpiScaling: () => Promise<number>
  /**
   * Fades in the node(s) with the given identifier over the given time
 in seconds. The identifier can contain a tag and/or a wildcard to target several
 nodes. If the fade time is not provided then the 'OpenSpaceEngine.FadeDuration'
 property will be used instead. If the third argument (endScript) is provided then
 that script will be run after the fade is finished.
   */
  fadeIn: (identifier: string, fadeTime?: number, endScript?: string) => Promise<void>
  /**
   * Fades out the node(s) with the given identifier over the given time
 in seconds. The identifier can contain a tag and/or a wildcard to target several
 nodes. If the fade time is not provided then the 'OpenSpaceEngine.FadeDuration'
 property will be used instead. If the third argument (endScript) is provided then
 that script will be run after the fade is finished.
   */
  fadeOut: (identifier: string, fadeTime?: number, endScript?: string) => Promise<void>
  /**
   * Checks whether the provided file exists.
   */
  fileExists: (file: string) => Promise<boolean>
  /**
   * Get a dictionary containing the current map with custom orderings for the Scene GUI tree. Each key in the dictionary corresponds to a branch in the tree, i.e. a specific GUI path.
   */
  guiOrder: () => Promise<table>
  /**
   * Returns whether a mission with the provided name has been loaded.
   */
  hasMission: (identifier: string) => Promise<boolean>
  /**
   * Returns whether a property with the given URI exists. The `uri` identifies the property or properties that are checked by this function and can include both wildcards `*` which match anything, as well as tags (`{tag}`) which match scene graph nodes that have this tag. There is also the ability to combine two tags through the `&`, `|`, and `~` operators. `{tag1&tag2}` will match anything that has the tag1 and the tag2. `{tag1|tag2}` will match anything that has the tag1 or the tag 2, and `{tag1~tag2}` will match anything that has tag1 but not tag2. If no wildcards or tags are provided at most one property value will be changed. With wildcards or tags all properties that match the URI are changed instead.

\\param uri The URI that identifies the property or properties whose values should be changed. The URI can contain 0 or 1 wildcard `*` characters or a tag expression (`{tag}`) that identifies a property owner.
   */
  hasProperty: (uri: string) => Promise<boolean>
  /**
   * Checks whether the specifies SceneGraphNode is present in the current scene.
   */
  hasSceneGraphNode: (nodeName: string) => Promise<boolean>
  /**
   * Returns the interaction sphere of the scene graph node with the given string as identifier.
   */
  interactionSphere: (identifier: string) => Promise<number>
  /**
   * Inverts the value of a boolean property with the given identifier.
   */
  invertBooleanProperty: (identifier: string) => Promise<void>
  /**
   * A utility function to check whether an object is empty or not. Identifies `nil`
 objects, Tables without any keys, and empty strings.

 \\param object The object to check
 \\return A Boolean that specifies if the object is empty or not
   */
  isEmpty: (object: any) => Promise<boolean>
  /**
   * Returns whether the current OpenSpace instance is the master node of a cluster configuration. If this instance is not part of a cluster, this function also returns 'true'.
   */
  isMaster: () => Promise<boolean>
  /**
   * Returns the strings of the script that are bound to the passed key and whether they were local or remote key binds.
   */
  keyBindings: (key: string) => Promise<string[]>
  /**
   * Returns the current layer server from the configuration
   */
  layerServer: () => Promise<string>
  /**
   * Loads the provided JSON file and returns it back to the caller. Please note that if the JSON contains keys that array of an array type, they are converted into a Dictionary with numerical keys and the numerical keys start with 1.
   */
  loadJson: (path: path) => Promise<table>
  /**
   * Load mission phases from file.
   */
  loadMission: (mission: table) => Promise<void>
  /**
   * Create a valid identifier from the provided input string. Will replace invalid characters like whitespaces and some punctuation marks with valid alternatives
   */
  makeIdentifier: (input: string) => Promise<string>
  /**
   * This function marks the scene graph nodes identified by name as
 interesting, which will provide shortcut access to focus buttons and featured
 properties.
   */
  markInterestingNodes: (sceneGraphNodes: string[]) => Promise<void>
  /**
   * This function marks interesting times for the current scene, which
 will create shortcuts for a quick access.
   */
  markInterestingTimes: (times: table[]) => Promise<void>
  /**
   * Returns a list of all scene graph nodes in the scene that have a renderable of the specific type
   */
  nodeByRenderableType: (type: string) => Promise<string[]>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Debug'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printDebug: (...args: any[]) => Promise<void>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Error'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printError: (...args: any[]) => Promise<void>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Fatal'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printFatal: (...args: any[]) => Promise<void>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Info'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printInfo: (...args: any[]) => Promise<void>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Trace'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printTrace: (...args: any[]) => Promise<void>
  /**
   * Logs the passed value to the installed LogManager with a LogLevel of 'Warning'. For Boolean, numbers, and strings, the internal values are printed, for all other types, the type is printed instead
   */
  printWarning: (...args: any[]) => Promise<void>
  /**
   * Returns a list of property identifiers that match the passed regular expression. The `uri` identifies the property or properties that are returned by this function and can include both wildcards `*` which match anything, as well as tags (`{tag}`) which match scene graph nodes that have this tag. There is also the ability to combine two tags through the `&`, `|`, and `~` operators. `{tag1&tag2}` will match anything that has the tag1 and the tag2. `{tag1|tag2}` will match anything that has the tag1 or the tag 2, and `{tag1~tag2}` will match anything that has tag1 but not tag2. If no wildcards or tags are provided at most one property value will be changed. With wildcards or tags all properties that match the URI are changed instead.

\\param uri The URI that identifies the property or properties whose values should be changed. The URI can contain 0 or 1 wildcard `*` characters or a tag expression (`{tag}`) that identifies a property owner.
   */
  property: (uri: string) => Promise<string[]>
  /**
   * Returns the value of the property identified by the provided URI. This function will provide an error message if no property matching the URI is found.
   */
  propertyValue: (uri: string) => Promise<string | number | boolean | table>
  /**
   * Returns the number of bytes of system memory that is currently being used. This function only works on Windows.
   */
  ramInUse: () => Promise<number>
  /**
   * Loads the CSV file provided as a parameter and returns it as a vector containing the values of the each row. The inner vector has the same number of values as the CSV has columns. The second parameter controls whether the first entry in the returned outer vector is containing the names of the columns
   */
  readCSVFile: (file: path, includeFirstLine?: boolean) => Promise<string[][]>
  /**
   * Reads a file from disk and return its contents.
   */
  readFile: (file: path) => Promise<string>
  /**
   * Reads a file from disk and return its as a list of lines.
   */
  readFileLines: (file: path) => Promise<string[]>
  /**
   * Rebinds all scripts from the old key (first argument) to the new
 key (second argument).
   */
  rebindKey: (oldKey: string, newKey: string) => Promise<void>
  /**
   * This function registers another Lua script that will be periodically executed as long as the application is running. The `identifier` is used to later remove the script. The `script` is being executed every `timeout` seconds. This timeout is only as accurate as the framerate at which the application is running. Optionally the `preScript` Lua script is run when registering the repeated script and the `postScript` is run when unregistering it or when the application closes. If the `timeout` is 0, the script will be executed every frame. The `identifier` has to be a unique name that cannot have been used to register a repeated script before. A registered script is removed with the #removeRepeatedScript function.
   */
  registerRepeatedScript: (identifier: string, script: string, timeout?: number, preScript?: string, postScript?: string) => Promise<void>
  /**
   * 
   */
  removeCustomProperty: (identifier: string) => Promise<void>
  /**
   * This function removes unmarks the scene graph nodes identified by
 name as interesting, thus removing the shortcuts from the features properties list.
   */
  removeInterestingNodes: (sceneGraphNodes: string[]) => Promise<void>
  /**
   * Removes a previously registered repeated script (see #registerRepeatedScript)
   */
  removeRepeatedScript: (identifier: string) => Promise<void>
  /**
   * Removes the SceneGraphNode identified by name or by extracting the 'Identifier' key if the parameter is a table.
   */
  removeSceneGraphNode: (node: string | table) => Promise<void>
  /**
   * Removes all SceneGraphNodes with identifiers matching the input regular expression.
   */
  removeSceneGraphNodesFromRegex: (regex: string) => Promise<void>
  /**
   * Given a ScreenSpaceRenderable name this script will remove it from the RenderEngine. The parameter can also be a table in which case the 'Identifier' key is used to look up the name from the table.
   */
  removeScreenSpaceRenderable: (identifier: string | table) => Promise<void>
  /**
   * Removes a tag (second argument) from a scene graph node (first argument)
   */
  removeTag: (uri: string, tag: string) => Promise<void>
  /**
   * Resets the camera position to the same position where the profile originally started
   */
  resetCamera: () => Promise<void>
  /**
   * Reset screenshot index to 0.
   */
  resetScreenshotNumber: () => Promise<void>
  /**
   * Returns the target path for a Windows shortcut file. This function will produce an error on non-Windows operating systems. The `path` has to be a valid Windows Shell link file.
   */
  resolveShortcut: (path: path) => Promise<path>
  /**
   * Collects all changes that have been made since startup, including all property changes and assets required, requested, or removed. All changes will be added to the profile that OpenSpace was started with, and the new saved file will contain all of this information. If the argument is provided, the settings will be saved into new profile with that name. If the argument is blank, the current profile will be saved to a backup file and the original profile will be overwritten. The second argument determines if a file that already exists should be overwritten, which is 'false' by default.
   */
  saveSettingsToProfile: (saveFilePath?: string, overwrite?: boolean) => Promise<void>
  /**
   * Returns a list of all scene graph nodes in the scene
   */
  sceneGraphNodes: () => Promise<string[]>
  /**
   * Schedules a `script` to be run in `delay` seconds. The delay is measured in wallclock time, which is seconds that occur in the real world, not in relation to the in-game time.
   */
  scheduleScript: (script: string, delay: number) => Promise<void>
  /**
   * Returns a list of all screen-space renderables
   */
  screenSpaceRenderables: () => Promise<string[]>
  /**
   * Set the currnet mission.
   */
  setCurrentMission: (identifier: string) => Promise<void>
  /**
   * This function sets the default values for the dashboard consisting
 of 'DashboardItemDate', 'DashboardItemSimulationIncrement', 'DashboardItemDistance',
 'DashboardItemFramerate', and 'DashboardItemParallelConnection'.
   */
  setDefaultDashboard: () => Promise<void>
  /**
   * Set a custom ordering of the items in a specific branch in the Scene GUI tree, i.e. for a specific GUI path.

\\param guiPath The GUI path for which the order should be set. \\param list A list of names of scene graph nodes or subgroups in the GUI, in the order of which they should appear in the tree. The list does not have to include all items in the given GUI path. Any excluded items will be placed after the ones in the list.
   */
  setGuiOrder: (guiPath: string, list: string[]) => Promise<void>
  /**
   * The scene graph node identified by the first string is reparented to be a child of the scene graph node identified by the second string.
   */
  setParent: (identifier: string, newParent: string) => Promise<void>
  /**
   * Registers the path token provided by the first argument to the path in the second argument. If the path token already exists, it will be silently overridden.
   */
  setPathToken: (pathToken: string, path: path) => Promise<void>
  /**
   * Sets the property or properties identified by the URI to the specified
value. The `uri` identifies which property or properties are affected by this function
call and can include both wildcards `*` which match anything, as well as tags (`{tag}`)
which match scene graph nodes that have this tag. There is also the ability to combine two
tags through the `&`, `|`, and `~` operators. `{tag1&tag2}` will match anything that has
the tag1 and the tag2. `{tag1|tag2}` will match anything that has the tag1 or the tag 2,
and `{tag1~tag2}` will match anything that has tag1 but not tag2. If no wildcards or tags
are provided at most one property value will be changed. With wildcards or tags all
properties that match the URI are changed instead. The second argument's type must match
the type of the property or properties or an error is raised. If a duration is provided,
the requested change will occur over the provided number of seconds. If no duration is
provided or the duration is 0, the change occurs instantaneously.

For example `openspace.setPropertyValue("*Trail.Renderable.Enabled", true)` will enable
any property that ends with "Trail.Renderable.Enabled", for example
"StarTrail.Renderable.Enabled", "EarthTrail.Renderable.Enabled", but not
"EarthTrail.Renderable.Size".

`openspace.setPropertyValue("{tag1}.Renderable.Enabled", true)` will enable any node in
the scene that has the "tag1" assigned to it.

If you only want to change a single property value, also see the #setPropertyValueSingle
function as it will do so in a more efficient way. The `setPropertyValue` function will
work for individual property value, but is more computationally expensive.

\\param uri The URI that identifies the property or properties whose values should be
changed. The URI can contain 0 or 1 wildcard `*` characters or a tag expression (`{tag}`)
that identifies a property owner
\\param value The new value to which the property/properties identified by the `uri`
should be changed to. The type of this parameter must agree with the type of the selected
property
\\param duration The number of seconds over which the change will occur. If not provided
or the provided value is 0, the change is instantaneously.
\\param easing If a duration larger than 0 is provided, this parameter controls the manner
in which the parameter is interpolated. Has to be one of "Linear", "QuadraticEaseIn",
"QuadraticEaseOut", "QuadraticEaseInOut", "CubicEaseIn", "CubicEaseOut", "CubicEaseInOut",
"QuarticEaseIn", "QuarticEaseOut", "QuarticEaseInOut", "QuinticEaseIn", "QuinticEaseOut",
"QuinticEaseInOut", "SineEaseIn", "SineEaseOut", "SineEaseInOut", "CircularEaseIn",
"CircularEaseOut", "CircularEaseInOut", "ExponentialEaseIn", "ExponentialEaseOut",
"ExponentialEaseInOut", "ElasticEaseIn", "ElasticEaseOut", "ElasticEaseInOut",
"BounceEaseIn", "BounceEaseOut", "BounceEaseInOut"
\\param postscript A Lua script that will be executed once the change of property value
is completed. If a duration larger than 0 was provided, it is at the end of the
interpolation. If 0 was provided, the script runs immediately.
   */
  setPropertyValue: (uri: string, value: nil | string | number | boolean | table, duration?: number, easing?: easingfunction, postscript?: string) => Promise<void>
  /**
   * Sets the single property identified by the URI to the specified value.
The `uri` identifies which property is affected by this function call. The second
argument's type must match the type of the property or an error is raised. If a duration
is provided, the requested change will occur over the provided number of seconds. If no
duration is provided or the duration is 0, the change occurs instantaneously.

If you want to change multiple property values simultaneously, also see the
#setPropertyValue function. The `setPropertyValueSingle` function however will work more
efficiently for individual property values.

\\param uri The URI that identifies the property
\\param value The new value to which the property identified by the `uri` should be
changed to. The type of this parameter must agree with the type of the selected property
\\param duration The number of seconds over which the change will occur. If not provided
or the provided value is 0, the change is instantaneously.
\\param easing If a duration larger than 0 is provided, this parameter controls the manner
in which the parameter is interpolated. Has to be one of "Linear", "QuadraticEaseIn",
"QuadraticEaseOut", "QuadraticEaseInOut", "CubicEaseIn", "CubicEaseOut", "CubicEaseInOut",
"QuarticEaseIn", "QuarticEaseOut", "QuarticEaseInOut", "QuinticEaseIn", "QuinticEaseOut",
"QuinticEaseInOut", "SineEaseIn", "SineEaseOut", "SineEaseInOut", "CircularEaseIn",
"CircularEaseOut", "CircularEaseInOut", "ExponentialEaseIn", "ExponentialEaseOut",
"ExponentialEaseInOut", "ElasticEaseIn", "ElasticEaseOut", "ElasticEaseInOut",
"BounceEaseIn", "BounceEaseOut", "BounceEaseInOut"
\\param postscript This parameter specifies a Lua script that will be executed once the
change of property value is completed. If a duration larger than 0 was provided, it is
at the end of the interpolation. If 0 was provided, the script runs immediately.
   */
  setPropertyValueSingle: (uri: string, value: nil | string | number | boolean | table, duration?: number, easing?: easingfunction, postscript?: string) => Promise<void>
  /**
   * Sets the folder used for storing screenshots or session recording frames
   */
  setScreenshotFolder: (newFolder: string) => Promise<void>
  /**
   * Take a screenshot and return the screenshot number. The screenshot will be stored in the ${SCREENSHOTS} folder.
   */
  takeScreenshot: () => Promise<integer>
  /**
   * A utility function to return a specific value based on a True/False condition.

 \\param condition The condition to check against
 \\param trueValue The value to return if the condition is True
 \\param falseValue The value to return if the condition is False
 \\return Either the trueValue of falseValue, depending on if the condition is true
 or not
   */
  ternary: (condition: boolean, trueValue: any, falseValue: any) => Promise<any>
  /**
   * Toggles the fade state of the node(s) with the given identifier over
 the given time in seconds. The identifier can contain a tag and/or a wildcard to
 target several nodes. If the fade time is not provided then the
 "OpenSpaceEngine.FadeDuration" property will be used instead. If the third argument
 (endScript) is provided then that script will be run after the fade is finished.
   */
  toggleFade: (identifier: string, fadeTime?: number, endScript?: string) => Promise<void>
  /**
   * Toggles the shutdown mode that will close the application after the countdown timer is reached
   */
  toggleShutdown: () => Promise<void>
  /**
   * Unloads a previously loaded mission.
   */
  unloadMission: (identifierOrMission: string | table) => Promise<void>
  /**
   * This function extracts the contents of a zip file. The first argument is the path to the zip file. The second argument is the directory where to put the extracted files. If the third argument is true, the compressed file will be deleted after the decompression is finished.
   */
  unzipFile: (source: string, destination: string, deleteSource?: boolean) => Promise<void>
  /**
   * This function returns information about the current OpenSpace version. The resulting table has the structure: \\code Version = { Major = <number> Minor = <number> Patch = <number> }, Commit = <string> Branch = <string> \\endcode
   */
  version: () => Promise<table>
  /**
   * Returns the number of bytes of video memory that is currently being used. This function only works on Windows.
   */
  vramInUse: () => Promise<number>
  /**
   * Walks a directory and returns the contents of the directory as absolute paths. The first argument is the path of the directory that should be walked, the second argument determines if the walk is recursive and will continue in contained directories. The default value for this parameter is \"false\". The third argument determines whether the table that is returned is sorted. The default value for this parameter is \"false\".
   */
  walkDirectory: (path: path, recursive?: boolean, sorted?: boolean) => Promise<path[]>
  /**
   * Walks a directory and returns the files of the directory as absolute paths. The first argument is the path of the directory that should be walked, the second argument determines if the walk is recursive and will continue in contained directories. The default value for this parameter is \"false\". The third argument determines whether the table that is returned is sorted. The default value for this parameter is \"false\".
   */
  walkDirectoryFiles: (path: path, recursive?: boolean, sorted?: boolean) => Promise<path[]>
  /**
   * Walks a directory and returns the subfolders of the directory as absolute paths. The first argument is the path of the directory that should be walked, the second argument determines if the walk is recursive and will continue in contained directories. The default value for this parameter is \"false\". The third argument determines whether the table that is returned is sorted. The default value for this parameter is \"false\".
   */
  walkDirectoryFolders: (path: path, recursive?: boolean, sorted?: boolean) => Promise<path[]>
  /**
   * Returns the world position of the scene graph node with the given string as identifier.
   */
  worldPosition: (identifier: string) => Promise<vec3>
  /**
   * Returns the world rotation matrix of the scene graph node with the given string as identifier.
   */
  worldRotation: (identifier: string) => Promise<mat3x3>
  /**
   * Writes out documentation files
   */
  writeDocumentation: () => Promise<void>
} // interface openspace

interface actionLibrary {
  /**
   * Returns information about the action as a table with the keys 'Identifier', 'Command', 'Name', 'Documentation', 'GuiPath', and 'Synchronization'.
   */
  action: (identifier: string) => Promise<table>
  /**
   * Returns all registered actions in the system as a table of tables each containing the keys 'Identifier', 'Command', 'Name', 'Documentation', 'GuiPath', and 'Synchronization'.
   */
  actions: () => Promise<table[]>
  /**
   * Checks if the passed identifier corresponds to an action.
   */
  hasAction: (identifier: string) => Promise<boolean>
  /**
   * Registers a new action. The first argument is the identifier which cannot have been used to register a previous action before, the second argument is the Lua command that is to be executed, and the optional third argument is the name used in a user-interface to refer to this action. The fourth is a human readable description of the command for documentation purposes. The fifth is the GUI path and the last parameter determines whether the action should be executed locally (= false) or remotely (= true, the default).
   */
  registerAction: (action: action) => Promise<void>
  /**
   * Removes an existing action from the list of possible actions. The action is identifies either by the passed name, or if it is a table, the value behind the 'Identifier' key is extract and used instead.
   */
  removeAction: (action: string | table) => Promise<void>
  /**
   * Triggers the action given by the specified identifier.
   */
  triggerAction: (id: string, arg?: table) => Promise<void>
} // interface actionLibrary

interface assetLibrary {
  /**
   * Adds an asset to the current scene. The parameter passed into this function is the path to the file that should be loaded.
   */
  add: (assetName: string) => Promise<void>
  /**
   * Returns the paths to all loaded assets, loaded directly or indirectly, as a table containing the paths to all loaded assets.
   */
  allAssets: () => Promise<path[]>
  /**
   * Returns true if the referenced asset already has been loaded. Otherwise false is returned. The parameter to this function is the path of the asset that should be tested.
   */
  isLoaded: (assetName: string) => Promise<boolean>
  /**
   * Reloads the asset with the specified name. If the asset was previously loaded explicity it will be removed and then re-added. If the asset was not previously loaded, it will only be loaded instead.
   */
  reload: (assetName: string) => Promise<void>
  /**
   * Removes the asset with the specfied name from the scene. The parameter to this function is the same that was originally used to load this asset, i.e. the path to the asset file.
   */
  remove: (assetName: string) => Promise<void>
  /**
   * Removes all assets that are currently loaded
   */
  removeAll: () => Promise<void>
  /**
   * Returns the paths to all loaded root assets, which are assets that are loaded directly either through a profile or by calling the `openspace.asset.add` method.
   */
  rootAssets: () => Promise<path[]>
} // interface assetLibrary

interface audioLibrary {
  /**
   * Returns the list of all tracks that are currently playing.

\\return The list of all tracks that are currently playing
   */
  currentlyPlaying: () => Promise<string[]>
  /**
   * Returns the global volume for all track. The number returned will be greater or equal to 0.

\\return The global volume
   */
  globalVolume: () => Promise<number>
  /**
   * Returns whether the track referred to by the \\p identifier is set to be looping or whether it should played only once. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped \\return `Yes` if the track is looping, `No` otherwise
   */
  isLooping: (identifier: string) => Promise<boolean>
  /**
   * Returns whether the track refered to by the \\p identifier is currently playing or paused. If it was be paused through a previous call to #pauseAudio, this function will return `true`. If it has just been created or resumed through a call to #resumeAudio, it will return `false`. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped \\return `true` if the track is currently paused, `false` if it is playing
   */
  isPaused: (identifier: string) => Promise<boolean>
  /**
   * Returns whether the track referred to by the \\p identifier is currently playing. A volume of 0 is still considered to be playing. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped \\return `true` if the track is currently playing, `false` otherwise
   */
  isPlaying: (identifier: string) => Promise<boolean>
  /**
   * Pauses the playback for all sounds, while keeping them valid. This function behaves the same as if calling #pauseAudio on all of the sounds that are currently playing.
   */
  pauseAll: () => Promise<void>
  /**
   * Pauses the playback of the track referred to by the \\p identifier. The playback can later be resumed through the #resumeAudio function. Trying to pause an already paused track will not do anything, but is valid. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped
   */
  pauseAudio: (identifier: string) => Promise<void>
  /**
   * Takes all of the sounds that are currently registers, unpauses them and plays them from their starting points
   */
  playAllFromStart: () => Promise<void>
  /**
   * Starts playing the audio file located and the provided \\p path. The \\p loop parameter determines whether the file is only played once, or on a loop. The sound is later referred to by the \\p identifier name. The audio file will be played in \"background\" mode, which means that each channel will be played at full volume. To play a video using spatial audio, use the #playAudio3d function instead.

\\param path The audio file that should be played \\param identifier The name for the sound that is used to refer to the sound \\param loop If `Yes` then the song will be played in a loop until the program is closed or the playing is stopped through the #stopAudio function
   */
  playAudio: (path: path, identifier: string, shouldLoop?: boolean) => Promise<void>
  /**
   * Starts playing the audio file located and the provided \\p path. The \\p loop parameter determines whether the file is only played once, or on a loop. The sound is later referred to by the \\p identifier name. The \\p position parameter determines the spatial location of the sound in a meter-based coordinate system. The position of the listener is (0,0,0) with the forward direction along the +y axis. This means that the \"left\" channel in a stereo setting is towards -x and the \"right\" channel towards x. This default value can be customized through the #set3dListenerParameters function. If you want to play a video without spatial audio, use the #playAudio function instead.

\\param path The audio file that should be played \\param identifier The name for the sound that is used to refer to the sound \\param position The position of the audio file in the 3D environment \\param loop If `Yes` then the song will be played in a loop until the program is closed or the playing is stopped through the #stopAudio function
   */
  playAudio3d: (path: path, identifier: string, position: vec3, shouldLoop?: boolean) => Promise<void>
  /**
   * Resumes the playback for all sounds that have been paused. Please note that this will also resume the playback for the sounds that have been manually paused, not just those that were paused through the #pauseAll function.
   */
  resumeAll: () => Promise<void>
  /**
   * Resumes the playback of a track that was previously paused through the #pauseAudio function. Trying to resume an already playing track will not do anything, but is valid. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped
   */
  resumeAudio: (identifier: string) => Promise<void>
  /**
   * Sets the position and orientation of the listener. This new position is automatically used to adjust the relative position of all 3D tracks. Each parameter to this function call is optional and if a value is omitted, the currently set value continues to be used instead. The coordinate system for the tracks and the listener is a meter-based coordinate system.

\\param position The position of the listener. \\param lookAt The direction vector of the forward direction \\param up The up-vector of the coordinate system
   */
  set3dListenerPosition: (position: vec3, lookAt?: vec3, up?: vec3) => Promise<void>
  /**
   * Updates the 3D position of a track started through the #playAudio3d function. See that function and the #set3dListenerParameters function for a complete description. The \\p identifier must be a name for a sound that was started through the #playAudio3d function.

\\param handle A valid handle for a track started through the #playAudio3d function \\param position The new position from which the track originates
   */
  set3dSourcePosition: (identifier: string, position: vec3) => Promise<void>
  /**
   * Sets the global volume for all track referred to the new \\p volume. The total for each track is the global volume set by this function multiplied with the volume for the specific track set through the #setVolume function. The default value for the global volume is 0.5. The volume should be a number bigger than 0, where 1 is the maximum volume level. The \\p fade controls whether the volume change should be immediately (if it is 0) or over how many seconds it should change. The default is for it to change over 500 ms.

\\param volume The new volume level. Must be greater or equal to 0 \\param fade How much time the fade from the current volume to the new volume should take
   */
  setGlobalVolume: (volume: number, fade?: number) => Promise<void>
  /**
   * Controls whether the track referred to by the \\p identifier should be looping or just be played once. If a track is converted to not looping, it will finish playing until the end of the file. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions.

\\param identifier The identifier to the track that should be stopped \\param loop If `Yes` then the song will be played in a loop until the program is closed or the playing is stopped through the #stopAudio function
   */
  setLooping: (identifier: string, shouldLoop: boolean) => Promise<void>
  /**
   * Sets the position of the speaker for the provided \\p channel to the provided \\p position. In general, this is considered an advanced feature to accommodate non-standard audio environments.

\\param channel The channel whose speaker's position should be changed \\param position The new position for the speaker
   */
  setSpeakerPosition: (handle: integer, position: vec3) => Promise<void>
  /**
   * Sets the volume of the track referred to by \\p handle to the new \\p volume. The volume should be a number bigger than 0, where 1 is the maximum volume level. The \\p fade controls whether the volume change should be immediately (if it is 0) or over how many seconds it should change. The default is for it to change over 500 ms.

\\param handle The handle to the track whose volume should be changed \\param volume The new volume level. Must be greater or equal to 0 \\param fade How much time the fade from the current volume to the new volume should take
   */
  setVolume: (identifier: string, volume: number, fade?: number) => Promise<void>
  /**
   * Returns the position for the speaker of the provided \\p channel. \\return The position for the speaker of the provided \\p channel
   */
  speakerPosition: (handle: integer) => Promise<vec3>
  /**
   * Stops all currently playing tracks. After this function, none of the identifiers used to previously play a sound a valid any longer, but can still be used by the #playAudio or #playAudio3d functions to start a new sound. This function behaves the same way as if manually calling #stopAudio on all of the sounds that have been started.
   */
  stopAll: () => Promise<void>
  /**
   * Stops the audio referenced by the \\p identifier. The \\p identifier must be a name for a sound that was started through the #playAudio or #playAudio3d functions. After this function, the \\p identifier can not be used for any other function anymore except for #playAudio or #playAudio3d to start a new sound.

\\param identifier The identifier to the track that should be stopped
   */
  stopAudio: (identifier: string) => Promise<void>
  /**
   * Returns the volume for the track referred to by the \\p handle. The number returned will be greater or equal to 0.

\\return The volume for the track referred to by the \\p handle, which will be greater or equal to 0
   */
  volume: (identifier: string) => Promise<number>
} // interface audioLibrary

interface dashboardLibrary {
  /**
   * Adds a new dashboard item to the main dashboard.
   */
  addDashboardItem: (dashboard: table) => Promise<void>
  /**
   * Adds a new dashboard item to an existing SceenSpaceDashboard.
   */
  addDashboardItemToScreenSpace: (identifier: string, dashboard: table) => Promise<void>
  /**
   * Removes all dashboard items from the main dashboard.
   */
  clearDashboardItems: () => Promise<void>
  /**
   * Returns all loaded dashboard-item identifiers from the main dashboard.

\\return a list of loaded dashboard-item identifiers from the main dashbaord
   */
  dashboardItems: () => Promise<string[]>
  /**
   * Removes the dashboard item with the specified identifier.
   */
  removeDashboardItem: (identifier: string | table) => Promise<void>
  /**
   * Removes all dashboard items from an existing ScreenSpaceDashboard.
   */
  removeDashboardItemsFromScreenSpace: (identifier: string) => Promise<void>
} // interface dashboardLibrary

interface debuggingLibrary {
  /**
   * Creates a new scene graph node that show the coordinate system used for the
 currently selected focus node, or a specified scene graph node.

 Usage:
 ```lua
 -- To add coordinate axes for the currently selected focus node, do not specify any
 -- parameters
 openspace.debugging.createCoordinateAxes()
 ```

 \\param nodeIdentifier The identifier of the scene graph node for which the axes
 should be added. If this parameter is not specified, the
 current focus node is used instead.
 \\param scale An optional parameter that specifies the size of the coordinate axes,
 in meters. If not specified, the size is set to 2.5 times the
 interaction sphere of the selected node.
   */
  createCoordinateAxes: (nodeIdentifier?: string, scale?: number) => Promise<void>
  /**
   * Removes the rendered control points.
   */
  removePathControlPoints: () => Promise<void>
  /**
   * Removes the currently rendered camera path if there is one.
   */
  removeRenderedCameraPath: () => Promise<void>
  /**
   * Render the current camera path from the path navigation system. The first optional argument is the number of samples to take along the path (defaults to 100). If a second optional argument is included and set to true, a line indicating the camera view direction along the path will also be rendered. This can be useful when debugging camera orientations. Finally, the third optional argument can be used to set the length (in meter) of the view direction lines.
   */
  renderCameraPath: (nSteps?: integer, renderDirections?: boolean, directionLineLength?: number) => Promise<void>
  /**
   * Render the control points for the camera path spline as spheres. The optional argument can be used to set the radius of the created spheres.
   */
  renderPathControlPoints: (radius?: number) => Promise<void>
} // interface debuggingLibrary

interface eventLibrary {
  /**
   * Disables the event with the provided identifier.
   */
  disableEvent: (identifier: integer) => Promise<void>
  /**
   * Enables the event with the provided identifier.
   */
  enableEvent: (identifier: integer) => Promise<void>
  /**
   * Returns the list of registered events.
   */
  registeredEvents: () => Promise<table[]>
  /**
   * Registers an action to be executed whenever an event is encountered. If the optional third parameter is provided, it describes a filter that the event is being checked against and only if it passes the filter, the action is triggered.
   */
  registerEventAction: (event: string, action: string, filter?: table) => Promise<void>
  /**
   * Unregisters a specific combination of event, action, and potentially a filter.
   */
  unregisterEventAction: (event: string, action: string, filter?: table) => Promise<void>
} // interface eventLibrary

interface exoplanetsLibrary {
  /**
   * Add a specific exoplanet system to the scene, based on a star name.

 Note that the formatting of the name must match the one in the dataset. That is, it
 must match the name as given in the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

 \\param starName The name of the star
   */
  addExoplanetSystem: (starName: string) => Promise<void>
  /**
   * Add multiple exoplanet systems to the scene, based on a list of names.

 Note that the formatting of the name must match the one in the dataset. That is,
 they must match the names as given in the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

 \\param listOfStarNames A list of star names for which to create the exoplanet systems
   */
  addExoplanetSystems: (listOfStarNames: string[]) => Promise<void>
  /**
   * Lists the names of the host stars of all exoplanet systems that have sufficient data for generating a visualization, and prints the list to the console.
   */
  listAvailableExoplanetSystems: () => Promise<void>
  /**
   * Returns a list with names of the host star of all the exoplanet systems that have sufficient data for generating a visualization, based on the module's loaded data file.

\\return A list of exoplanet host star names.
   */
  listOfExoplanets: () => Promise<string[]>
  /**
   * Load a set of exoplanets based on custom data, in the form of a CSV file, and add
 them to the rendering. Can be used to load custom datasets, or more recent planets
 than what are included in the internal data file that is released with OpenSpace.

 The format and column names in the CSV should be the same as the ones provided by
 the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

 We recommend downloading the file from the [Exoplanet Archive's Composite data table](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PSCompPars),
 where multiple sources are combined into one row per planet.

 Please remember to include all columns in the file download, as missing data columns
 may lead to an incomplete visualization.

 Also, avoid loading too large files of planets, as each added system will affect the
 rendering performance.

 \\param csvFile A path to a .csv file that contains the data for the exoplanets
   */
  loadExoplanetsFromCsv: (csvFile: string) => Promise<void>
  /**
   * Load a set of exoplanet information based on custom data in the form of a CSV file.

The format and column names in the CSV should be the same as the ones provided by the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).

When dowloading the data from the archive we recommend including all columns, since a few required ones are not selected by default.

\\param csvFile A path to the CSV file to load the data from.

\\return A list of objects of the type [ExoplanetSystemData](#exoplanets_exoplanet_system_data), that can be used to create the scene graph nodes for the exoplanet systems
   */
  loadSystemDataFromCsv: (csvFile: string) => Promise<table[]>
  /**
   * Remove a loaded exoplanet system.

\\param starName The name of the host star for the system to remove.
   */
  removeExoplanetSystem: (starName: string) => Promise<void>
  /**
   * Return an object containing the information needed to add a specific exoplanet system. The data is retrieved from the module's prepared datafile for exoplanets. This file is in a binary format, for fast retrieval during runtime.

\\param starName The name of the star to get the information for.

\\return An object of the type [ExoplanetSystemData](#exoplanets_exoplanet_system_data) that can be used to create the scene graph nodes for the exoplanet system
   */
  systemData: (starName: string) => Promise<table>
} // interface exoplanetsLibrary

interface gaiaLibrary {
  /**
   * Creates a clipping box for a specific Gaia dataset, that can be used to filter out
 stars that are outside of the box. The box is visualized as a grid in the scene.

 Note that only one clipping box can be active at a time. If a new box is added, the
 old one will be removed.

 \\param identifier The identifier of the scene graph node with a
 [RenderableGaiaStars](#gaiamission_renderablegaiastars) to be
 filtered
 \\param size The size of each dimension of the box, in Kiloparsec
 \\param position The position of the center of the box, specified in galactic
 coordinates in Kiloparsec
   */
  addClippingBox: (identifier: string, size: vec3, position: vec3) => Promise<void>
  /**
   * Creates a clipping sphere for a specific Gaia dataset, that can be used to filter
 out stars that are outside of the sphere. The sphere is visualized as a grid in the
 scene.

 Note that only one clipping sphere can be active at a time. If a new one is added,
 the old one will be removed.

 \\param identifier The identifier of the scene graph node with a
 [RenderableGaiaStars](#gaiamission_renderablegaiastars) to be
 filtered
 \\param radius The desired radius outside of the clipping sphere, in Kiloparsec
   */
  addClippingSphere: (identifier: string, radius: number) => Promise<void>
  /**
   * Remove any added clipping box.
   */
  removeClippingBox: () => Promise<void>
  /**
   * Remove any added clipping sphere.
   */
  removeClippingSphere: () => Promise<void>
} // interface gaiaLibrary

interface globebrowsingLibrary {
  /**
   * Retrieves all info files recursively in the directory passed as the first argument
 to this function. The color and height tables retrieved from these info files are
 then added to the RenderableGlobe identified by name passed to the second argument.

 Usage:
 ```lua
 openspace.globebrowsing.addBlendingLayersFromDirectory(directory, "Earth")
 ```
   */
  addBlendingLayersFromDirectory: (directory: string, nodeName: string) => Promise<void>
  /**
   * Creates a new SceneGraphNode that can be used as focus node for a specific point on
 a globe. If no altitude is specified, an altitude of 0 will be used.

 Usage:
 ```lua
 openspace.globebrowsing.addFocusNodeFromLatLong(
 "Olympus Mons", "Mars", -18.65, 226.2, optionalAltitude
 )
 ```
   */
  addFocusNodeFromLatLong: (name: string, globeIdentifier: string, latitude: number, longitude: number, altitude?: number) => Promise<void>
  /**
   * Retrieves all info files recursively in the directory passed as the first argument
 to this function. The name and location retrieved from these info files are then
 used to create new SceneGraphNodes that can be used as focus nodes.

 Usage:
 ```lua
 openspace.globebrowsing.addFocusNodesFromDirectory(directory, "Mars")
 ```
   */
  addFocusNodesFromDirectory: (directory: string, nodeName: string) => Promise<void>
  /**
   * Add a GeoJson layer specified by the given table to the specified globe.

\\param globeIdentifier The identifier of the scene graph node for the globe \\param table A table with information about the GeoJson layer. See [this page](#globebrowsing_geojsoncomponent) for details on what fields and settings the table may contain
   */
  addGeoJson: (globeIdentifier: string, table: table) => Promise<void>
  /**
   * Add a GeoJson layer from the given file name and add it to the current anchor node, if it is a globe. Note that you might have to increase the height offset for the added feature to be visible on the globe, if using a height map.

\\param filename The path to the GeoJSON file \\param name An optional name that the loaded feature will get in the user interface
   */
  addGeoJsonFromFile: (filename: string, name?: string) => Promise<void>
  /**
   * Adds a new layer from NASA GIBS to the Earth globe.

 For all specifications, see
 [this page](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products).

 Usage:
 ```lua
 openspace.globebrowsing.addGibsLayer(
 "AIRS_Temperature_850hPa_Night", "2km", "2013-07-15", "Present", "png"
 )
 ```
   */
  addGibsLayer: (layer: string, resolution: string, format: string, startDate: string, endDate: string) => Promise<void>
  /**
   * Adds a layer to the specified globe. The second argument is the layer group which can be any of the supported layer groups. The third argument is the dictionary defining the layer.

\\param globeIdentifier The identifier of the scene graph node of which to add the layer. The renderable of the scene graph node must be a [RenderableGlobe](#globebrowsing_renderableglobe) \\param layerGroup The identifier of the layer group in which to add the layer \\param layer A dictionary defining the layer. See [this page](#globebrowsing_layer) for details on what fields and settings the dictionary may contain
   */
  addLayer: (globeIdentifier: string, layerGroup: string, layer: table) => Promise<void>
  /**
   * Returns an array of tables that describe the available layers that are supported by the WMS server identified by the provided name. The `URL` component of the returned table can be used in the `FilePath` argument for a call to the `addLayer` function to add the value to a globe.

\\param name The name of the WMS server for which to get the information
   */
  capabilitiesWMS: (name: string) => Promise<table[]>
  /**
   * Creates an XML configuration for a GIBS dataset.

 For all specifications, see
 [this page](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products).

 Usage:
 ```lua
 openspace.globebrowsing.addLayer(
 "Earth",
 "ColorLayers",
 {
 Name = "MODIS_Terra_Chlorophyll_A",
 FilePath = openspace.globebrowsing.createGibsGdalXml(
 "MODIS_Terra_Chlorophyll_A",
 "2013-07-02",
 "1km",
 "png"
 )
 }
 )
 ```
   */
  createGibsGdalXml: (layerName: string, date: string, resolution: string, format: string) => Promise<string>
  /**
   * Creates an XML configuration for a temporal GIBS dataset to be used in a
 TemporalTileprovider.
   */
  createTemporalGibsGdalXml: (layerName: string, resolution: string, format: string) => Promise<string>
  /**
   * Remove the GeoJson layer specified by the given table or string identifier from the specified globe.

\\param globeIdentifier The identifier of the scene graph node for the globe \\param tableOrIdentifier Either an identifier for the GeoJson layer to be removed, or a table that includes the identifier
   */
  deleteGeoJson: (globeIdentifier: string, tableOrIdentifier: string | table) => Promise<void>
  /**
   * Removes a layer from the specified globe.

\\param globeIdentifier The identifier of the scene graph node of which to remove the layer. The renderable of the scene graph node must be a [RenderableGlobe](#globebrowsing_renderableglobe) \\param layerGroup The identifier of the layer group from which to remove the layer \\param layerOrName Either the identifier for the layer or a dictionary with the `Identifier` key that is used instead
   */
  deleteLayer: (globeIdentifier: string, layerGroup: string, layerOrName: string | table) => Promise<void>
  /**
   * Get geographic coordinates of the camera position in latitude, longitude, and altitude (degrees and meters).

\\param useEyePosition If true, use the view direction of the camera instead of the camera position
   */
  geoPositionForCamera: (useEyePosition?: boolean) => Promise<[number, number, number]>
  /**
   * Go to the chunk on a globe with given index x, y, level.

\\param globeIdentifier The identifier of the scene graph node for the globe \\param x The x value of the tile index \\param y The y value of the tile index \\param level The level of the tile index
   */
  goToChunk: (globeIdentifier: string, x: integer, y: integer, level: integer) => Promise<void>
  /**
   * Returns the list of layers for the specified globe, for a specific layer group.

\\param globeIdentifier The identifier of the scene graph node for the globe \\param layerGroup The identifier of the layer group for which to list the layers
   */
  layers: (globeIdentifier: string, layerGroup: string) => Promise<string[]>
  /**
   * Loads and parses the WMS capabilities XML file from a remote server.

\\param name The name of the capabilities that can be used to later refer to the set of capabilities \\param globe The identifier of the globe for which this server is applicable \\param url The URL at which the capabilities file can be found
   */
  loadWMSCapabilities: (name: string, globe: string, url: string) => Promise<void>
  /**
   * Loads all WMS servers from the provided file and passes them to the
 'openspace.globebrowsing.loadWMSCapabilities' file.
   */
  loadWMSServersFromFile: (filePath: string) => Promise<void>
  /**
   * Rearranges the order of a single layer on a globe. The first position in the list has index 0, and the last position is given by the number of layers minus one.

The `source` and `destination` parameters can also be the identifiers of the layers to be moved. If `destination` is a name, the source layer is moved below that destination layer.

\\param globeIdentifier The identifier of the globe \\param layerGroup The identifier of the layer group \\param source The original position of the layer that should be moved, either as an index in the list or the identifier of the layer to be moved \\param destination The new position in the list, either as an index in the list or as the identifier of the layer after which to place the moved layer
   */
  moveLayer: (globeIdentifier: string, layerGroup: string, source: integer | string, destination: integer | string) => Promise<void>
  /**
   * Parses the passed info file and return the table with the information provided in
 the info file.

 The return table contains the optional keys: `Color`, `Height`, `Node`, `Location`,
 `Identifier`.

 Usage:
 ```lua
 local t = openspace.globebrowsing.parseInfoFile(file)
 openspace.globebrowsing.addLayer("Earth", "ColorLayers", t.color)
 openspace.globebrowsing.addLayer("Earth", "HeightLayers", t.height)
 ```
   */
  parseInfoFile: (file: string) => Promise<table>
  /**
   * Removes the specified WMS server from the list of available servers. The name parameter corresponds to the first argument in the `loadWMSCapabilities` call that was used to load the WMS server.

\\param name The name of the WMS server to remove
   */
  removeWMSServer: (name: string) => Promise<void>
  /**
   * Sets the position of a scene graph node that has a
 [GlobeTranslation](#base_translation_globetranslation) and/or
 [GlobeRotation](#base_rotation_globerotation).

 Usage:
 ```lua
 openspace.globebrowsing.setNodePosition(
 "Scale_StatueOfLiberty", "Earth", 40.000, -117.5, optionalAltitude
 )
 ```

 \\param nodeIdentifier The identifier of the scene graph node to move
 \\param globeIdentifier The identifier of the [RenderableGlobe](#globebrowsing_renderableglobe)
 that the object should be put on
 \\param latitude The latitude value for the new position, in degrees
 \\param longitude The longitude value for the new position, in degrees
 \\param altitude An optional altitude value for the new position, in meters. If
 excluded, an altitude of 0 will be used
   */
  setNodePosition: (nodeIdentifier: string, globeIdentifier: string, latitude: number, longitude: number, altitude?: number) => Promise<void>
  /**
   * Sets the position of a scene graph node that has a
 [GlobeTranslation](#base_translation_globetranslation) and/or
 [GlobeRotation](#base_rotation_globerotation) to match the camera. Only
 uses camera position not rotation. If useAltitude is true, then the position
 will also be updated to the camera's altitude.

 Usage:
 ```lua
 openspace.globebrowsing.setNodePositionFromCamera(
 "Scale_StatueOfLiberty", optionalUseAltitude
 )
 ```

 \\param nodeIdentifier The identifier of the scene graph node to move
 \\param useAltitude If true, the camera's altitude will also be used for the new
 positions. Otherwise, it will not.
   */
  setNodePositionFromCamera: (nodeIdentifer: string, useAltitude?: boolean) => Promise<void>
} // interface globebrowsingLibrary

interface iswaLibrary {
  /**
   * Adds a cdf files to choose from.
   */
  addCdfFiles: (path: string) => Promise<void>
  /**
   * Adds a IswaCygnet.
   */
  addCygnet: (id?: integer, type?: string, group?: string) => Promise<void>
  /**
   * Adds KameleonPlanes from cdf file.
   */
  addKameleonPlanes: (group: string, pos: integer) => Promise<void>
  /**
   * Adds a Screen Space Cygnets.
   */
  addScreenSpaceCygnet: (d: table) => Promise<void>
  /**
   * Remove a Cygnets.
   */
  removeCygnet: (name: string) => Promise<void>
  /**
   * Remove a group of Cygnets.
   */
  removeGroup: (name: string) => Promise<void>
  /**
   * Remove a Screen Space Cygnets.
   */
  removeScreenSpaceCygnet: (id: integer) => Promise<void>
  /**
   * Sets the base url.
   */
  setBaseUrl: (url: string) => Promise<void>
} // interface iswaLibrary

interface keyframeRecordingLibrary {
  /**
   * Adds a keyframe at the specified sequence-time
   */
  addCameraKeyframe: (sequenceTime: number) => Promise<void>
  /**
   * Adds a keyframe at the specified sequence-time
   */
  addScriptKeyframe: (sequenceTime: number, script: string) => Promise<void>
  /**
   * 
   */
  keyframes: () => Promise<table[]>
  /**
   * Loads a sequence from the specified file
   */
  loadSequence: (filename: path) => Promise<void>
  /**
   * Move keyframe of `index` to the new specified `sequenceTime`
   */
  moveKeyframe: (index: integer, sequenceTime: number) => Promise<void>
  /**
   * Starts a new sequence of keyframes, any previously loaded sequence is discarded
   */
  newSequence: () => Promise<void>
  /**
   * Pauses a playing sequence
   */
  pause: () => Promise<void>
  /**
   * Playback sequence optionally from the specified `sequenceTime` or if not specified starts playing from the current time set within the sequence
   */
  play: (sequenceTime?: number) => Promise<void>
  /**
   * Removes a keyframe at the specified 0-based index
   */
  removeKeyframe: (index: integer) => Promise<void>
  /**
   * Saves the current sequence of keyframes to disk by the optionally specified `filename`.
   */
  saveSequence: (filename: path) => Promise<void>
  /**
   * Update the camera position at keyframe specified by the 0-based index
   */
  updateKeyframe: (index: integer) => Promise<void>
} // interface keyframeRecordingLibrary

interface modulesLibrary {
  /**
   * Checks whether the passed OpenSpaceModule is loaded.
   */
  isLoaded: (moduleName: string) => Promise<boolean>
} // interface modulesLibrary

interface navigationLibrary {
  /**
   * Directly adds to the global roll of the camera. This is a rotation around the line between the focus node and the camera (not always the same as the camera view direction)

\\param value the value to add
   */
  addGlobalRoll: (value: number) => Promise<void>
  /**
   * Directly add to the global rotation of the camera (around the focus node).

\\param xValue the value to add in the x-direction (a positive value rotates to the right and a negative value to the left) \\param yValue the value to add in the y-direction (a positive value rotates the focus upwards and a negative value downwards)
   */
  addGlobalRotation: (xValue: number, yValue: number) => Promise<void>
  /**
   * Directly adds to the local roll of the camera. This is the rotation around the camera's forward/view direction.

\\param value the value to add
   */
  addLocalRoll: (value: number) => Promise<void>
  /**
   * Directly adds to the local rotation of the camera (around the camera's current position).

\\param xValue the value to add in the x-direction (a positive value rotates to the left and a negative value to the right) \\param yValue the value to add in the y-direction (a positive value rotates the camera upwards and a negative value downwards)
   */
  addLocalRotation: (xValue: number, yValue: number) => Promise<void>
  /**
   * Directly adds to the truck movement of the camera. This is the movement along the line from the camera to the focus node.

A positive value moves the camera closer to the focus, and a negative value moves the camera further away.

\\param value the value to add
   */
  addTruckMovement: (value: number) => Promise<void>
  /**
   * Returns the deadzone for the desired axis of the provided joystick.

\\param joystickName the name for the joystick or game controller which information should be returned \\param axis the joystick axis for which to get the deadzone value

\\return the deadzone value
   */
  axisDeadzone: (joystickName: string, axis: integer) => Promise<number>
  /**
   * Bind an axis of a joystick to be used as a certain type, and optionally define detailed settings for the axis.

\\param joystickName the name for the joystick or game controller that should be bound \\param axis the axis of the joystick that should be bound \\param axisType the type of movement that the axis should be mapped to \\param shouldInvert decides if the joystick axis movement should be inverted or not \\param joystickType what type of joystick or axis this is. Decides if the joystick behaves more like a joystick or a trigger. Either `\"JoystickLike\"` or `\"TriggerLike\"`, where `\"JoystickLike\"` is default \\param isSticky if true, the value is calculated relative to the previous value. If false, the value is used as is \\param shouldFlip reverses the movement of the camera that the joystick produces \\param sensitivity sensitivity for this axis, in addition to the global sensitivity
   */
  bindJoystickAxis: (joystickName: string, axis: integer, axisType: string, shouldInvert?: boolean, joystickType?: string, isSticky?: boolean, shouldFlip?: boolean, sensitivity?: number) => Promise<void>
  /**
   * Binds an axis of a joystick to a numerical property value in OpenSpace. This means that interacting with the joystick will change the property value, within a given min-max range.

The axis value will be rescaled from [-1, 1] to the provided [min, max] range (default is [0, 1]).

\\param joystickName the name for the joystick or game controller that should be bound \\param axis the axis of the joystick that should be bound \\param propertyUri the identifier (URI) of the property that this joystick axis should modify \\param min the minimum value that this axis can set for the property \\param max the maximum value that this axis can set for the property \\param shouldInvert if the joystick movement should be inverted or not \\param isRemote if true, the property change will also be executed on connected nodes. If false, the property change will only affect the master node
   */
  bindJoystickAxisProperty: (joystickName: string, axis: integer, propertyUri: string, min?: number, max?: number, shouldInvert?: boolean, isRemote?: boolean) => Promise<void>
  /**
   * Bind a Lua script to one of the buttons for a joystick.

\\param joystickName the name for the joystick or game controller \\param button the button to which to bind the script \\param command the script that should be executed on button trigger \\param documentation the documentation for the provided script/command \\param action the action for when the script should be executed. This defaults to `\"Press\"`, which means that the script is run when the user presses the button. Alternatives are `\"Idle\"` (if the button is unpressed and has been unpressed since the last frame), `\"Repeat\"` (if the button has been pressed since longer than the last frame), and `\"Release\"` (if the button was released since the last frame) \\param isRemote a value saying whether the command is going to be executable locally or remotely, where the latter is the default
   */
  bindJoystickButton: (joystickName: string, button: integer, command: string, documentation: string, action?: string, isRemote?: boolean) => Promise<void>
  /**
   * Remove all commands that are currently bound to a button of a joystick or game controller

\\param joystickName the name for the joystick or game controller \\param button the button for which to clear the commands
   */
  clearJoystickButton: (joystickName: string, button: integer) => Promise<void>
  /**
   * Return the distance to the current focus node.

\\return the distance, in meters
   */
  distanceToFocus: () => Promise<number>
  /**
   * Return the distance to the current focus node's bounding sphere.

\\return the distance, in meters
   */
  distanceToFocusBoundingSphere: () => Promise<number>
  /**
   * Return the distance to the current focus node's interaction sphere.

\\return the distance, in meters
   */
  distanceToFocusInteractionSphere: () => Promise<number>
  /**
   * Move the camera to the node with the specified identifier. The optional double specifies the duration of the motion, in seconds. If the optional bool is set to true the target up vector for camera is set based on the target node. Either of the optional parameters can be left out.

\\param nodeIdentifier The identifier of the node to which we want to fly \\param useUpFromTargetOrDuration If this value is a boolean value (`true` or `false`), this value determines whether we want to end up with the camera facing along the selected node's up direction. If this value is a numerical value, refer to the documnentation of the `duration` parameter \\param duration The duration (in seconds) how long the flying to the selected node should take. If this value is left out, a sensible default value is uses, which can be configured in the engine
   */
  flyTo: (nodeIdentifier: string, useUpFromTargetOrDuration?: boolean | number, duration?: number) => Promise<void>
  /**
   * Fly the camera to a geographic coordinate (latitude, longitude and altitude) on a globe, using the path navigation system. If the node is a globe, the longitude and latitude is expressed in the body's native coordinate system. If it is not, the position on the surface of the interaction sphere is used instead.

\\param node The identifier of a scene graph node. If an empty string is provided, the current anchor node is used \\param latitude The latitude of the target coordinate, in degrees \\param longitude The longitude of the target coordinate, in degrees \\param altitude The altitude of the target coordinate, in meters \\param duration An optional duration for the motion to take, in seconds. For example, a value of 5 means \"fly to this position over a duration of 5 seconds\" \\param shouldUseUpVector If true, try to use the up-direction when computing the target position for the camera. For globes, this means that North should be up, in relation to the camera's view direction. Note that for this to take effect, rolling motions must be enabled in the Path Navigator settings.
   */
  flyToGeo: (node: string, latitude: number, longitude: number, altitude: number, duration?: number, shouldUseUpVector?: boolean) => Promise<void>
  /**
   * Fly the camera to a geographic coordinate (latitude and longitude) on a globe, using the path navigation system. If the node is a globe, the longitude and latitude is expressed in the body's native coordinate system. If it is not, the position on the surface of the interaction sphere is used instead.

The distance to fly to can either be set to be the current distance of the camera to the target object, or the default distance from the path navigation system.

\\param node The identifier of a scene graph node. If an empty string is provided, the current anchor node is used \\param latitude The latitude of the target coordinate, in degrees \\param longitude The longitude of the target coordinate, in degrees \\param useCurrentDistance If true, use the current distance of the camera to the target globe when going to the specified position. If false, or not specified, set the distance based on the bounding sphere and the distance factor setting in Path Navigator \\param duration An optional duration for the motion to take, in seconds. For example, a value of 5 means \"fly to this position over a duration of 5 seconds\" \\param shouldUseUpVector If true, try to use the up-direction when computing the target position for the camera. For globes, this means that North should be up, in relation to the camera's view direction. Note that for this to take effect, rolling motions must be enabled in the Path Navigator settings.
   */
  flyToGeo2: (node: string, latitude: number, longitude: number, useCurrentDistance?: boolean, duration?: number, shouldUseUpVector?: boolean) => Promise<void>
  /**
   * Move the camera to the node with the specified identifier. The second argument is the desired target height above the target node's bounding sphere, in meters. The optional double specifies the duration of the motion, in seconds. If the optional bool is set to true, the target up vector for camera is set based on the target node. Either of the optional parameters can be left out.

\\param nodeIdentifier The identifier of the node to which we want to fly \\param height The height (in meters) to which we want to fly. The way the height is defined specifically determines on the type of node to which the fly-to command is pointed. \\param useUpFromTargetOrDuration If this value is a boolean value (`true` or `false`), this value determines whether we want to end up with the camera facing along the selected node's up direction. If this value is a numerical value, refer to the documnentation of the `duration` parameter \\param duration The duration (in seconds) how long the flying to the selected node should take. If this value is left out, a sensible default value is uses, which can be configured in the engine
   */
  flyToHeight: (nodeIdentifier: string, height: number, useUpFromTargetOrDuration?: boolean | number, duration?: number) => Promise<void>
  /**
   * Create a path to the navigation state described by the input table. Note that roll must be included for the target up direction in the navigation state to be taken into account.

\\param navigationState A [NavigationState](#core_navigation_state) to fly to \\param duration An optional duration for the motion to take, in seconds. For example, a value of 5 means \"fly to this position over a duration of 5 seconds\"
   */
  flyToNavigationState: (navigationState: table, duration?: number) => Promise<void>
  /**
   * Return the current [NavigationState](#core_navigation_state) as a Lua table.

By default, the reference frame will be picked based on whether the orbital navigator is currently following the anchor node rotation. If it is, the anchor will be chosen as reference frame. If not, the reference frame will be set to the scene graph root.

\\param frame the identifier of an optional scene graph node to use as reference frame for the NavigationState

\\return a Lua table representing the current NavigationState of the camera
   */
  getNavigationState: (frame?: string) => Promise<table>
  /**
   * Returns true if a camera path is currently running, and false otherwise.

\\return Whether a camera path is currently active, or not
   */
  isFlying: () => Promise<boolean>
  /**
   * Return all the information bound to a certain joystick axis.

\\param joystickName the name for the joystick or game controller with the axis for which to find the information \\param axis the joystick axis for which to find the information

\\return an object with information about the joystick axis
   */
  joystickAxis: (joystickName: string, axis: integer) => Promise<table>
  /**
   * Get the Lua script that is currently bound to be executed when the provided button is pressed/triggered.

\\param joystickName the name for the joystick or game controller \\param button the button for which to get the command

\\return the currently bound Lua script
   */
  joystickButton: (joystickName: string, button: integer) => Promise<string>
  /**
   * Fade rendering to black, jump to the specified navigation state, and then fade in. This is done by triggering another script that handles the logic.

\\param nodeIdentifier The identifier of the scene graph node to jump to \\param fadeDuration An optional duration for the fading. If not included, the property in Navigation Handler will be used
   */
  jumpTo: (nodeIdentifier: string, fadeDuration?: number) => Promise<void>
  /**
   * Immediately move the camera to a geographic coordinate on a node by first fading the rendering to black, jump to the specified coordinate, and then fade in. If the node is a globe, the longitude and latitude values are expressed in the body's native coordinate system. If it is not, the position on the surface of the interaction sphere is used instead.

This is done by triggering another script that handles the logic.

\\param node The identifier of a scene graph node. If an empty string is provided, the current anchor node is used \\param latitude The latitude of the target coordinate, in degrees \\param longitude The longitude of the target coordinate, in degrees \\param altitude An optional altitude, given in meters over the reference surface of the globe. If no altitude is provided, the altitude will be kept as the current distance to the reference surface of the specified node \\param fadeDuration An optional duration for the fading. If not included, the property in Navigation Handler will be used
   */
  jumpToGeo: (node: string, latitude: number, longitude: number, altitude?: number, fadeDuration?: number) => Promise<void>
  /**
   * Fade rendering to black, jump to the specified node, and then fade in. This is done by triggering another script that handles the logic.

\\param navigationState A [NavigationState](#core_navigation_state) to jump to. \\param useTimeStamp if true, and the provided NavigationState includes a timestamp, the time will be set as well. \\param fadeDuration An optional duration for the fading. If not included, the property in Navigation Handler will be used.
   */
  jumpToNavigationState: (navigationState: table, useTimeStamp?: boolean, fadeDuration?: number) => Promise<void>
  /**
   * Return the complete list of connected joysticks.

\\return a list of joystick names
   */
  listAllJoysticks: () => Promise<string[]>
  /**
   * Set the camera position by loading a [NavigationState](#core_navigation_state) from file. The file should be in json format, such as the output files of `saveNavigationState`.

\\param filePath the path to the file, including the file name (and extension, if it is anything other than `.navstate`) \\param useTimeStamp if true, and the provided NavigationState includes a timestamp, the time will be set as well.
   */
  loadNavigationState: (filePath: string, useTimeStamp?: boolean) => Promise<void>
  /**
   * Returns the position in the local Cartesian coordinate system of the specified node that corresponds to the given geographic coordinates. In the local coordinate system, the position (0,0,0) corresponds to the globe's center. If the node is a globe, the longitude and latitude is expressed in the body's native coordinate system. If it is not, the position on the surface of the interaction sphere is used instead.

\\param nodeIdentifier The identifier of the scene graph node \\param latitude The latitude of the geograpic position, in degrees \\param longitude The longitude of the geographic position, in degrees \\param altitude The altitude, in meters
   */
  localPositionFromGeo: (nodeIdentifier: string, latitude: number, longitude: number, altitude: number) => Promise<[number, number, number]>
  /**
   * Reset the camera direction to point at the aim node.
   */
  retargetAim: () => Promise<void>
  /**
   * Reset the camera direction to point at the anchor node.
   */
  retargetAnchor: () => Promise<void>
  /**
   * Save the current [NavigationState](#core_navigation_state) to a file with the path given by the first argument.

By default, the reference frame will be picked based on whether the orbital navigator is currently following the anchor node rotation. If it is, the anchor will be chosen as reference frame. If not, the reference frame will be set to the scene graph root.

\\param path the file path for where to save the NavigationState, including the file name. If no extension is added, the file is saved as a `.navstate` file. \\param frame the identifier of the scene graph node which coordinate system should be used as a reference frame for the NavigationState.
   */
  saveNavigationState: (path: string, frame?: string) => Promise<void>
  /**
   * Set the deadzone value for a particular joystick axis, which means that any input less than this value is completely ignored.

\\param joystickName the name for the joystick or game controller \\param axis the joystick axis for which to set the deadzone \\param deadzone the new deadzone value
   */
  setAxisDeadZone: (joystickName: string, axis: integer, deadzone: number) => Promise<void>
  /**
   * Set the current focus node for the navigation, or re-focus on it if it was already the focus node.

Per default, the camera will retarget to center the focus node in the view. The velocities will also be reset so that the camera stops moving after any retargeting is done. However, both of these behaviors may be skipped using the optional arguments.

\\param identifier The identifier of the scene graph node to focus \\param shouldRetarget If true, retarget the camera to look at the focus node \\param shouldResetVelocities If true, reset the camera velocities so that the camera stops after its done retargeting (or immediately if retargeting is not done)
   */
  setFocus: (identifier: string, shouldRetarget?: boolean, shouldResetVelocities?: boolean) => Promise<void>
  /**
   * Set the camera position from a provided [NavigationState](#core_navigation_state).

\\param navigationState a table describing the NavigationState to set \\param useTimeStamp if true, and the provided NavigationState includes a timestamp, the time will be set as well
   */
  setNavigationState: (navigationState: table, useTimeStamp?: boolean) => Promise<void>
  /**
   * Picks the next node from the interesting nodes out of the profile and selects that. If the current anchor is not an interesting node, the first node in the list will be selected.
   */
  targetNextInterestingAnchor: () => Promise<void>
  /**
   * Picks the previous node from the interesting nodes out of the profile and selects that. If the current anchor is not an interesting node, the first node in the list will be selected.
   */
  targetPreviousInterestingAnchor: () => Promise<void>
  /**
   * Immediately start applying the chosen IdleBehavior. If none is specified, use the one set to default in the OrbitalNavigator.
   */
  triggerIdleBehavior: (choice?: string) => Promise<void>
  /**
   * Fly linearly to a specific distance in relation to the focus node.

\\param distance The distance to fly to, in meters above the bounding sphere. \\param duration An optional duration for the motion to take, in seconds.
   */
  zoomToDistance: (distance: number, duration?: number) => Promise<void>
  /**
   * Fly linearly to a specific distance in relation to the focus node, given as a relative value based on the size of the object rather than in meters.

\\param distance The distance to fly to, given as a multiple of the bounding sphere of the current focus node bounding sphere. A value of 1 will result in a position at a distance of one times the size of the bounding sphere away from the object. \\param duration An optional duration for the motion, in seconds.
   */
  zoomToDistanceRelative: (distance: number, duration?: number) => Promise<void>
  /**
   * Zoom linearly to the current focus node, using the default distance.

\\param duration An optional duration for the motion to take, in seconds. For example, a value of 5 means \"zoom in over 5 seconds\"
   */
  zoomToFocus: (duration?: number) => Promise<void>
} // interface navigationLibrary

interface openglCapabilitiesLibrary {
  /**
   * Returns all available extensions as a list of names.
   */
  extensions: () => Promise<string[]>
  /**
   * Returns the value of a call to `glGetString(GL_VENDOR)`. This will give detailed information about the vendor of the main graphics card. This string can be used if the automatic Vendor detection failed.
   */
  glslCompiler: () => Promise<string>
  /**
   * Returns the vendor of the main graphics card.
   */
  gpuVendor: () => Promise<string>
  /**
   * Tests whether the current instance supports the passed OpenGL version. The parameter has to have the form 'X.Y' or 'X.Y.Z'.
   */
  hasOpenGLVersion: (version: string) => Promise<boolean>
  /**
   * Checks is a specific `extension` is supported or not.
   */
  isExtensionSupported: (extension: string) => Promise<boolean>
  /**
   * Returns the largest dimension for a 2D texture on this graphics card.
   */
  max2DTextureSize: () => Promise<integer>
  /**
   * Returns the largest dimension for a 3D texture on this graphics card.
   */
  max3DTextureSize: () => Promise<integer>
  /**
   * Returns the maximum number of atomic counter buffer bindings that are available on the main graphics card.
   */
  maxAtomicCounterBufferBindings: () => Promise<integer>
  /**
   * Returns the maximum number of shader storage bindings that are available on the main graphics card.
   */
  maxShaderStorageBufferBindings: () => Promise<integer>
  /**
   * Returns the maximum number of texture units that are available on the main graphics card.
   */
  maxTextureUnits: () => Promise<integer>
  /**
   * Returns the maximum number of uniform buffer bindings that are available on the main graphics card.
   */
  maxUniformBufferBindings: () => Promise<integer>
  /**
   * Returns the maximum OpenGL version that is supported on this platform.
   */
  openGLVersion: () => Promise<string>
} // interface openglCapabilitiesLibrary

interface orbitalnavigationLibrary {
  /**
   * Set maximum allowed distance to a multiplier of the interaction sphere of the focus node
   */
  setRelativeMaxDistance: (multiplier: number) => Promise<void>
  /**
   * Set minimum allowed distance to a multiplier of the interaction sphere of the focus node
   */
  setRelativeMinDistance: (multiplier: number) => Promise<void>
} // interface orbitalnavigationLibrary

interface parallelLibrary {
  /**
   * Connect to parallel.
   */
  connect: () => Promise<void>
  /**
   * Disconnect from parallel.
   */
  disconnect: () => Promise<void>
  /**
   * 
   */
  joinServer: (port: string, address: string, serverName: string, password: string, hostpassword?: string, name?: string) => Promise<void>
  /**
   * Request to be the host for this session.
   */
  requestHostship: () => Promise<void>
  /**
   * Resign hostship.
   */
  resignHostship: () => Promise<void>
} // interface parallelLibrary

interface pathnavigationLibrary {
  /**
   * Continue playing a paused camera path.
   */
  continuePath: () => Promise<void>
  /**
   * Create a camera path as described by the instruction in the input argument.

\\param pathInstruction A table representing a [PathInstruction](#core_path_instruction) that describes a camera path to be created
   */
  createPath: (pathInstruction: table) => Promise<void>
  /**
   * Pause a playing camera path.
   */
  pausePath: () => Promise<void>
  /**
   * Immediately skips to the end of the current camera path, if one is being played.
   */
  skipToEnd: () => Promise<void>
  /**
   * Stops a path, if one is being played.
   */
  stopPath: () => Promise<void>
} // interface pathnavigationLibrary

interface scriptSchedulerLibrary {
  /**
   * Clears all scheduled scripts.
   */
  clear: (group?: integer) => Promise<void>
  /**
   * Load timed scripts from a Lua script file that returns a list of scheduled scripts.
   */
  loadFile: (fileName: string) => Promise<void>
  /**
   * Load a single scheduled script. The first argument is the time at which the scheduled script is triggered, the second argument is the script that is executed in the forward direction, the optional third argument is the script executed in the backwards direction, and the optional last argument is the universal script, executed in either direction.
   */
  loadScheduledScript: (time: string, forwardScript: string, backwardScript?: string, universalScript?: string, group?: integer) => Promise<void>
  /**
   * Returns the list of all scheduled scripts
   */
  scheduledScripts: () => Promise<table[]>
} // interface scriptSchedulerLibrary

interface sessionRecordingLibrary {
  /**
   * Returns true if session recording is currently playing back a recording.
   */
  isPlayingBack: () => Promise<boolean>
  /**
   * Returns true if session recording is currently recording a recording.
   */
  isRecording: () => Promise<boolean>
  /**
   * Pauses or resumes the playback progression through keyframes.
   */
  setPlaybackPause: (pause: boolean) => Promise<void>
  /**
   * Starts a playback session with keyframe times that are relative to the time since the recording was started (the same relative time applies to the playback). When playback starts, the simulation time is automatically set to what it was at recording time. The string argument is the filename to pull playback keyframes from (the file path is relative to the RECORDINGS variable specified in the config file). If a second input value of true is given, then playback will continually loop until it is manually stopped.
   */
  startPlayback: (file: string, loop?: boolean, shouldWaitForTiles?: boolean, screenshotFps?: integer) => Promise<void>
  /**
   * Starts a recording session. The string argument is the filename used for the file where the recorded keyframes are saved.
   */
  startRecording: () => Promise<void>
  /**
   * Stops a playback session before playback of all keyframes is complete.
   */
  stopPlayback: () => Promise<void>
  /**
   * Stops a recording session. `dataMode` has to be \"Ascii\" or \"Binary\". If `overwrite` is true, any existing session recording file will be overwritten, false by default.
   */
  stopRecording: (recordFilePath: path, dataMode: string, overwrite?: boolean) => Promise<void>
  /**
   * Toggles the pause function, i.e. temporarily setting the delta time to 0 and restoring it afterwards.
   */
  togglePlaybackPause: () => Promise<void>
} // interface sessionRecordingLibrary

interface skybrowserLibrary {
  /**
   * Takes an identifier to a sky browser and adds a rendered copy to it. The first argument is the position of the first copy. The position is in RAE or Cartesian coordinates, depending on if 'Use Radius Azimuth Elevation' is checked. The second argument is the number of copies. If RAE is used, they will be evenly spread out on the azimuth.
   */
  addDisplayCopy: (identifier: string, numberOfCopies?: integer, position?: vec3) => Promise<void>
  /**
   * Takes the identifier of the sky target and a sky browser and adds them to the sky browser module.
   */
  addPairToSkyBrowserModule: (targetId: string, browserId: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser or sky target. Rotates the camera so that the target is placed in the center of the view.
   */
  adjustCamera: (id: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser and animates its corresponding target to the center of the current view.
   */
  centerTargetOnScreen: (identifier: string) => Promise<void>
  /**
   * Creates a sky browser and a target.
   */
  createTargetBrowserPair: () => Promise<void>
  /**
   * Disables the hover circle, if there is one added to the sky browser module.
   */
  disableHoverCircle: () => Promise<void>
  /**
   * Finetunes the target depending on a mouse drag. rendered copy to it. First argument is the identifier of the sky browser, second is the start position of the drag and third is the end position of the drag.
   */
  finetuneTargetPosition: (identifier: string, translation: vec2) => Promise<void>
  /**
   * Takes an identifier to a sky browser and starts the initialization for that browser. That means that the browser starts to try to connect to the AAS WorldWide Telescope application by sending it messages. And that the target matches its appearance to its corresponding browser.
   */
  initializeBrowser: (identifier: string) => Promise<void>
  /**
   * Returns a list of all the loaded AAS WorldWide Telescope images that have been loaded. Each image has a name, thumbnail url, equatorial spherical coordinates RA and Dec, equatorial Cartesian coordinates, if the image has celestial coordinates, credits text, credits url and the identifier of the image which is a unique number.
   */
  listOfImages: () => Promise<table>
  /**
   * Takes an identifier to a sky browser or target and loads the WWT image collection to that browser.
   */
  loadImagesToWWT: (identifier: string) => Promise<void>
  /**
   * Sets the image collection as loaded in the sky browser. Takes an identifier to the sky browser.
   */
  loadingImageCollectionComplete: (identifier: string) => Promise<void>
  /**
   * Moves the hover circle to the coordinate specified by the image index.
   */
  moveCircleToHoverImage: (imageUrl: string) => Promise<void>
  /**
   * Reloads the sky browser display copy for the node index that is sent in. .If no ID is sent in, it will reload all display copies on that node.
   */
  reloadDisplayCopyOnNode: (nodeIndex: integer, id?: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser and removes the latest added rendered copy to it.
   */
  removeDisplayCopy: (identifier: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser or target and an index to an image. Removes that image from that sky browser.
   */
  removeSelectedImageInBrowser: (identifier: string, imageUrl: string) => Promise<void>
  /**
   * Takes in identifier to a sky browser or target and removes them.
   */
  removeTargetBrowserPair: (identifier: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser or a sky target and a vertical field of view. Changes the field of view as specified by the input.
   */
  scrollOverBrowser: (identifier: string, scroll: number) => Promise<void>
  /**
   * Takes an index to an image and selects that image in the currently selected sky browser.
   */
  selectImage: (imageUrl: string) => Promise<void>
  /**
   * Sends all sky browsers' identifiers to their respective CEF browser.
   */
  sendOutIdsToBrowsers: () => Promise<void>
  /**
   * Takes an identifier to a sky browser or a sky target and a rgb color in the ranges [0, 255].
   */
  setBorderColor: (identifier: string, red: integer, green: integer, blue: integer) => Promise<void>
  /**
   * Takes an identifier to a sky browser and a radius value between 0 and 1, where 0 is rectangular and 1 is circular
   */
  setBorderRadius: (identifier: string, radius: number) => Promise<void>
  /**
   * Sets the screen space size of the sky browser to the numbers specified by the input [x, y].
   */
  setBrowserRatio: (identifier: string, ratio: number) => Promise<void>
  /**
   * Takes the identifier of a sky browser or a sky target and equatorial coordinates Right Ascension and Declination. The target will animate to this coordinate and the browser will display the coordinate.
   */
  setEquatorialAim: (identifier: string, rightAscension: number, declination: number) => Promise<void>
  /**
   * Takes an identifier to a screen space renderable and adds it to the module.
   */
  setHoverCircle: (identifier: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser or a sky target, an image index and the order which it should have in the selected image list. The image is then changed to have this order.
   */
  setImageLayerOrder: (identifier: string, imageUrl: string, imageOrder: integer) => Promise<void>
  /**
   * Takes an identifier to a sky browser or sky target, an index to an image and a value for the opacity.
   */
  setOpacityOfImageLayer: (identifier: string, imageUrl: string, opacity: number) => Promise<void>
  /**
   * Takes an identifier to a sky browser or target. Sets that sky browser currently selected.
   */
  setSelectedBrowser: (identifier: string) => Promise<void>
  /**
   * Takes an identifier to a sky browser or a sky target and a vertical field of view. Changes the field of view as specified by the input.
   */
  setVerticalFov: (identifier: string, verticalFieldOfView: number) => Promise<void>
  /**
   * Show or hide all targets and browsers. Takes a boolean that sets it to either be shown or not.
   */
  showAllTargetsAndBrowsers: (show: boolean) => Promise<void>
  /**
   * Starts the fine-tuning of the target rendered copy to it.
   */
  startFinetuningTarget: (identifier: string) => Promise<void>
  /**
   * Starts the setup process of the sky browers. This function calls the Lua function 'sendOutIdsToBrowsers' in all nodes in the cluster.
   */
  startSetup: () => Promise<void>
  /**
   * Stop animations. Takes an identifier to a sky browser.
   */
  stopAnimations: (identifier: string) => Promise<void>
  /**
   * Returns a table of data regarding the current view and the sky browsers and targets. returns a table of data regarding the current targets.
   */
  targetData: () => Promise<table>
  /**
   * Takes an identifier to a sky browser or sky target and the [x, y] starting position and the [x, y] translation vector.
   */
  translateScreenSpaceRenderable: (identifier: string, startingPositionX: number, startingPositionY: number, translationX: number, translationY: number) => Promise<void>
  /**
   * Returns the AAS WorldWide Telescope image collection url.
   */
  wwtImageCollectionUrl: () => Promise<table>
} // interface skybrowserLibrary

interface sonificationLibrary {
  /**
   * Adds the given list of planets to the PlanetsSonification internal list of Planets and Moons.
   */
  addPlanets: (planets: table) => Promise<void>
} // interface sonificationLibrary

interface spaceLibrary {
  /**
   * Returns the cartesian world position of a ra dec coordinate with distance. If the coordinate is given as strings the format should be ra 'XhYmZs' and dec 'XdYmZs'. If the coordinate is given as numbers the values should be in degrees.
   */
  convertFromRaDec: (rightAscension: number | string, declination: number | string, distance: number) => Promise<vec3>
  /**
   * Returns the formatted ra, dec strings and distance for a given cartesian world coordinate.
   */
  convertToRaDec: (x: number, y: number, z: number) => Promise<[string, string, number]>
  /**
   * 
   */
  readKeplerFile: (p: path, type: string) => Promise<table[]>
  /**
   * Takes the provided TLE file, converts it into a SPICE kernel and returns a
 SpiceTranslation instance that can be used to access the information in the TLE
 file using SPICE's superior integral solver.

 The second return value is the spice kernel that should be loaded and unloaded by
 whoever called this function.
   */
  tleToSpiceTranslation: (tlePath: string) => Promise<[ translation, spicekernel ]>
} // interface spaceLibrary

interface spiceLibrary {
  /**
   * This function converts a TLE file into SPK format and saves it at the provided path. The last parameter is only used if there are multiple craft specified in the provided TLE file and is selecting which (0-based index) of the list to create a kernel from.

This function returns the SPICE ID of the object for which the kernel was created
   */
  convertTLEtoSPK: (tle: path, spk: path, elementToExtract?: integer) => Promise<integer>
  /**
   * Returns a list of all loaded kernels
   */
  kernels: () => Promise<path[]>
  /**
   * Loads the provided SPICE kernel by name. The name can contain path tokens, which are automatically resolved.
   */
  loadKernel: (kernel: string | string[]) => Promise<void>
  /**
   * Returns the position for a given body relative to another body, in a given frame of reference, at a specific time. Example: openspace.spice.position('INSIGHT', 'MARS',' GALACTIC', '2018 NOV 26 19:45:34')
   */
  position: (target: string, observer: string, frame: string, date: string) => Promise<vec3>
  /**
   * Returns the rotationMatrix for a given body in a frame of reference at a specific time. Example: openspace.spice.rotationMatrix('INSIGHT_LANDER_CRUISE','MARS', '2018 NOV 26 19:45:34')
   */
  rotationMatrix: (body: string, frame: string, date: string) => Promise<mat3x3>
  /**
   * Returns a list of Spice Bodies loaded into the system. Returns SPICE built in frames if builtInFrames. Returns User loaded frames if !builtInFrames.
   */
  spiceBodies: (includeBuiltIn: boolean) => Promise<Map<string, string>>
  /**
   * Unloads the provided SPICE kernel. The name can contain path tokens, which are automatically resolved.
   */
  unloadKernel: (kernel: string | string[]) => Promise<void>
} // interface spiceLibrary

interface statemachineLibrary {
  /**
   * Returns true if there is a defined transition between the current state and the given string name of a state, otherwise false.
   */
  canGoToState: (state: string) => Promise<boolean>
  /**
   * Creates a state machine from a list of states and transitions. See State and Transition documentation for details. The optional thrid argument is the identifier of the desired initial state. If left out, the first state in the list will be used.
   */
  createStateMachine: (states: table, transitions: table, startState?: string) => Promise<void>
  /**
   * Returns the string name of the current state that the statemachine is in.
   */
  currentState: () => Promise<string>
  /**
   * Destroys the current state machine and deletes all the memory.
   */
  destroyStateMachine: () => Promise<void>
  /**
   * Triggers a transition from the current state to the state with the given identifier. Requires that the specified string corresponds to an existing state, and that a transition between the two states exists.
   */
  goToState: (newState: string) => Promise<void>
  /**
   * Returns a list with the identifiers of all the states that can be transitioned to from the current state.
   */
  possibleTransitions: () => Promise<string[]>
  /**
   * Prints information about the current state and possible transitions to the log.
   */
  printCurrentStateInfo: () => Promise<void>
  /**
   * Saves the current state machine to a .dot file as a directed graph. The resulting graph can be rendered using external tools such as Graphviz. The first parameter is the name of the file, and the second is an optional directory. If no directory is given, the file is saved to the temp folder.
   */
  saveToDotFile: (filename: string, directory?: string) => Promise<void>
  /**
   * Immediately sets the current state to the state with the given name, if it exists. This is done without doing a transition and completely ignores the previous state.
   */
  setInitialState: (startState: string) => Promise<void>
} // interface statemachineLibrary

interface syncLibrary {
  /**
   * Synchronizes the http resource identified by the name passed as the first parameter and the version provided as the second parameter. The application will hang while the data is being downloaded.
   */
  syncResource: (identifier: string, version: integer) => Promise<boolean>
  /**
   * Unsynchronizes the http resources identified by the name passed as the first parameter by removing all data that was downloaded as part of the original synchronization. If the second parameter is provided, is it the version of the resources that is unsynchronized, if the parameter is not provided, all versions for the specified http resource are removed.
   */
  unsyncResource: (identifier: string, version?: integer) => Promise<void>
} // interface syncLibrary

interface systemCapabilitiesLibrary {
  /**
   * Returns the cache line size.
   */
  cacheLineSize: () => Promise<integer>
  /**
   * Returns the cache size.
   */
  cacheSize: () => Promise<integer>
  /**
   * Returns the number of cores.
   */
  cores: () => Promise<integer>
  /**
   * Returns all supported exteions as comma-separated string.
   */
  extensions: () => Promise<string>
  /**
   * Returns the operating system as a string. The exact format of the returned string is implementation and operating system-dependent but it should contain the manufacturer and the version.
   */
  fullOperatingSystem: () => Promise<string>
  /**
   * Returns the amount of available, installed main memory (RAM) on the system in MB.
   */
  installedMainMemory: () => Promise<integer>
  /**
   * Returns the L2 associativity.
   */
  L2Associativity: () => Promise<integer>
  /**
   * This function returns a string identifying the currently running operating system. For Windows, the string is 'windows', for MacOS, it is 'osx', and for Linux it is 'linux'. For any other operating system, this function returns 'other'.
   */
  os: () => Promise<string>
} // interface systemCapabilitiesLibrary

interface telemetryLibrary {
  /**
   * Adds the given list of nodes to the NodesTelemetry's internal list.
   */
  addNodes: (nodes: table) => Promise<void>
} // interface telemetryLibrary

interface timeLibrary {
  /**
   * Modify a specified timestamp by a given delta time. That is, advance the value either forwards or backwards in time.

The returned value will be of the same type as the first argument. That is, either a number of seconds past the J2000 epoch, or an ISO 8601 date string.

\\param base The timestamp to alter, either given as an ISO 8601 date string or a number of seconds past the J2000 epoch. \\param change The amount of time to add to the specified timestamp. Can be given either in a number of seconds (including negative), or as a string of the form [-]XX(s,m,h,d,M,y] with (s)econds, (m)inutes, (h)ours, (d)ays, (M)onths, and (y)ears as units and an optional - sign to move backwards in time.

\\return The updated timestamp
   */
  advancedTime: (base: string | number, change: string | number) => Promise<string | number>
  /**
   * Convert the given time from either a J2000 seconds number to an ISO 8601 timestamp, or vice versa.

If the given time is a timestamp, the function returns a double precision value representing the ephemeris version of that time; that is, the number of TDB seconds past the J2000 epoch.

If the given time is a J2000 seconds value, the function returns a ISO 8601 timestamp.

\\param time The timestamp to convert, either given as an ISO 8601 date string or a number of seconds past the J2000 epoch.

\\return The converted timestamp
   */
  convertTime: (time: string | number) => Promise<string | number>
  /**
   * Returns the current application time as the number of seconds since the OpenSpace application started.

\\return The number of seconds since OpenSpace started
   */
  currentApplicationTime: () => Promise<number>
  /**
   * Returns the current time as the number of seconds since the J2000 epoch.

\\return The current time, as the number of seconds since the J2000 epoch
   */
  currentTime: () => Promise<number>
  /**
   * Returns the current wall time as an ISO 8601 date string (YYYY-MM-DDTHH-MN-SS) in the UTC timezone.

\\return The current wall time, in the UTC time zone, as an ISO 8601 date string
   */
  currentWallTime: () => Promise<string>
  /**
   * Returns the amount of simulated time that passes in one second of real time.

\\return The simulated delta time, in seconds per real time second
   */
  deltaTime: () => Promise<number>
  /**
   * Returns the number of seconds between the provided start time and end time.

If the end time is before the start time, the return value is negative. If the start time is equal to the end time, the return value is 0.

\\param start The start time for the computation, given as an ISO 8601 date string \\param end The end time for the computation, given as an ISO 8601 date string

\\return The time between the start time and end time
   */
  duration: (start: string, end: string) => Promise<number>
  /**
   * Set the amount of simulation time that happens in one second of real time, by smoothly interpolating to that value.

\\param deltaTime The value to set the speed to, in seconds per real time second \\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value for delta time interpolation specified in the TimeManager.
   */
  interpolateDeltaTime: (deltaTime: number, interpolationDuration?: number) => Promise<void>
  /**
   * Interpolate the simulation speed to the first delta time step in the list that is larger than the current simulation speed, if any.

\\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value specified in the TimeManager.
   */
  interpolateNextDeltaTimeStep: (interpolationDuration?: number) => Promise<void>
  /**
   * Same behaviour as `setPause`, but with interpolation. That is, if it should be paused, the delta time will be interpolated to 0, and if unpausing, the delta time will be interpolated to whatever delta time value is set.

\\param isPaused True if the simulation should be paused, and false otherwise \\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value for pause/unpause specified in the TimeManager.
   */
  interpolatePause: (isPaused: boolean, interpolationDuration?: number) => Promise<void>
  /**
   * Interpolate the simulation speed to the first delta time step in the list that is smaller than the current simulation speed, if any.

\\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value specified in the TimeManager.
   */
  interpolatePreviousDeltaTimeStep: (interpolationDuration?: number) => Promise<void>
  /**
   * Set the current simulation time to the specified value, using interpolation. The time can be specified either a number of seconds past the J2000 epoch, or as a ISO 8601 string.

Note that providing time zone using the Z format is not supported. UTC is assumed.

\\param time The time to set. If the parameter is a number, the value is the number of seconds past the J2000 epoch. If it is a string, it has to be a valid ISO 8601-like date string of the format YYYY-MM-DDTHH:MN:SS. \\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value for time interpolation specified in the TimeManager.
   */
  interpolateTime: (time: string | number, interpolationDutation?: number) => Promise<void>
  /**
   * Increment the current simulation time by the specified number of seconds, using interpolation.

\\param delta The number of seconds to increase the current simulation time by \\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value for time interpolation specified in the TimeManager.
   */
  interpolateTimeRelative: (delta: number, interpolationDuration?: number) => Promise<void>
  /**
   * Toggle the pause function, i.e. if the simulation is paused it will resume, and otherwise it will be paused. This is done by smoothly interpolating from the current delta time value to 0 (pause), or from 0 to the current delta time value (unpause).

\\param interpolationDuration The number of seconds that the interpolation should be done over. If excluded, the time is decided based on the default value for pause/unpause specified in the TimeManager.
   */
  interpolateTogglePause: (interpolationDuration?: number) => Promise<void>
  /**
   * Returns whether the simulation time is currently paused or is progressing.

\\return True if the simulation is paused, and false otherwise
   */
  isPaused: () => Promise<boolean>
  /**
   * This allows for a keypress (via keybinding) to have dual functionality. In normal operational mode it will behave just like time_interpolateTogglePause, but during playback of a session recording it will pause the playback without manipulating the delta time.
   */
  pauseToggleViaKeyboard: () => Promise<void>
  /**
   * Returns the number of seconds per day, where a day in this case is exactly 24 hours. The total number of seconds is equal to 86400.

\\return The number of seconds in a day
   */
  secondsPerDay: () => Promise<number>
  /**
   * Returns the number of seconds in a Gregorian year, which is equal to 31556952.

\\return The number of seconds in a Gregorian year
   */
  secondsPerYear: () => Promise<number>
  /**
   * Set the amount of simulation time that happens in one second of real time.

\\param deltaTime The value to set the speed to, in seconds per real time second
   */
  setDeltaTime: (deltaTime: number) => Promise<void>
  /**
   * Set the list of discrete delta time steps for the simulation speed that can be quickly jumped between. The list will be sorted to be in increasing order. A negative verison of each specified time step will be added per default as well.

\\param deltaTime The list of delta times, given in seconds per real time second. Should only include positive values.
   */
  setDeltaTimeSteps: (deltaTime: number[]) => Promise<void>
  /**
   * Immediately set the simulation speed to the first delta time step in the list that is larger than the current choice of simulation speed, if any.
   */
  setNextDeltaTimeStep: () => Promise<void>
  /**
   * Set whether the simulation should be paused or not. Note that to pause means temporarily setting the delta time to 0, and unpausing means restoring it to whatever delta time value is set.

\\param isPaused True if the simulation should be paused, and false otherwise
   */
  setPause: (isPaused: boolean) => Promise<void>
  /**
   * Immediately set the simulation speed to the first delta time step in the list that is smaller than the current choice of simulation speed, if any.
   */
  setPreviousDeltaTimeStep: () => Promise<void>
  /**
   * Set the current simulation time to the specified value. The time can be specified either a number of seconds past the J2000 epoch, or as a ISO 8601 string.

Note that providing time zone using the Z format is not supported. UTC is assumed.

\\param time The time to set. If the parameter is a number, the value is the number of seconds past the J2000 epoch. If it is a string, it has to be a valid ISO 8601-like date string of the format YYYY-MM-DDTHH:MN:SS.
   */
  setTime: (time: number | string) => Promise<void>
  /**
   * Returns the current time as an date string of the form (YYYY MON DDTHR:MN:SC.### ::RND) as returned by SPICE.

\\return The current time, in the format used by SPICE (YYYY MON DDTHR:MN:SC.### ::RND)
   */
  SPICE: () => Promise<string>
  /**
   * Toggle the pause function, i.e. if the simulation is paused it will resume, and otherwise it will be paused. Note that to pause means temporarily setting the delta time to 0, and unpausing means restoring it to whatever delta time value is set.
   */
  togglePause: () => Promise<void>
  /**
   * Returns the current time as an ISO 8601 date string (YYYY-MM-DDTHH:MN:SS).

\\return The current time, as an ISO 8601 date string
   */
  UTC: () => Promise<string>
} // interface timeLibrary

} // namespace OpenSpace