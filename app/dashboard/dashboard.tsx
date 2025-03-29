import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button} from "~/components/button/button";
import {WithDocumentEvent} from "~/components/with-document-event/with-document-event";
import {WithState} from "~/components/with-state/with-state";
import {Input} from "~/components/input/input";
import {WithLifecycle} from "~/components/with-lifecycle/with-lifecycle";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function Dashboard({ loaderData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apps = (() => {
        const [data, setData] = useState<any>(null);
        const [status, setStatus] = useState("loading");
        const [counter, setCounter] = useState(0);

        useEffect(() => {
            (async () => {
                const res = await fetch(`http://localhost:8080/api/v1/list/`);
                const json = await res.json();

                setData(json);
                setStatus("success");
            })();
        }, [counter]);

        return {
            data, status, reload: () => setCounter(x => x + 1),
        };
    })();

    return (
        <div>
            <WithState initialState={{}}>
                {({ state, setState }) => {

                }}
            </WithState>
            <div className="flex justify-between items-center m-4 p-4 rounded-xl border-0">
                <div>
                    <h1 className="text-4xl">Lecrev App Hosting</h1>
                </div>
                <>
                    <Button className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500" onClick={() => setIsModalOpen(true)}>
                        Create app <span className="text-xs">(or press N)</span>
                    </Button>
                    <WithDocumentEvent type="keypress">{(event) => {
                        if (event.code === "KeyN") {
                            setIsModalOpen(true)
                        }
                    }}</WithDocumentEvent>
                </>
            </div>

            {isModalOpen && (
                <div className="bg-gray-500/70 fixed top-0 left-0" style={{ width: '100vw', height: '100vh' }}>

                    <WithDocumentEvent type="keydown">
                        {(event) => {
                            if (event.code === "Escape") {
                                setIsModalOpen(false);
                            }
                        }}
                    </WithDocumentEvent>

                    <WithDocumentEvent type="keypress">
                        {(event) => {
                            if (event.code === "KeyN") {
                                setIsModalOpen(false);
                            }
                        }}
                    </WithDocumentEvent>

                    <div className="fixed bg-white rounded-xl border-0 p-4" style={{ top: "50%", left: "50%", width: 400, transform: "translate(-50%,-50%)" }}>
                        <h1 className="text-2xl">Create app</h1>
                        <WithLifecycle>
                            {() => {
                                const schema = useMemo(() => z.object({
                                    name: z.string(),
                                    repository: z.string().url("Required url"),
                                    type: z.enum(["PostgreSQL", "React SPA", "Spring Boot"]),
                                }), []);

                                const form = useForm({
                                    resolver: zodResolver(schema),
                                });

                                const {
                                    register,
                                    handleSubmit,
                                    formState,
                                } = form;

                                return (
                                    <>
                                        <form onSubmit={handleSubmit((d) => console.log(d))}>
                                            <div className="p-2">
                                                <label htmlFor="">Select app type</label>
                                            </div>
                                            <div className="p-2">
                                                <label htmlFor="">name</label>
                                            </div>
                                            <div className="p-2">
                                                <Input type="text" className="text-xs w-full" {...register('name')} />
                                            </div>
                                            <div className="p-2">
                                                <select id="" {...register('type')}>
                                                    <option value="Spring Boot">Spring Boot App</option>
                                                    <option value="React SPA">React SPA</option>
                                                </select>
                                            </div>
                                            <div className="p-2">
                                                <label htmlFor="">git repository</label>
                                            </div>
                                            <div className="p-2">
                                                <Input type="text" className="text-xs w-full" {...register('repository')} />
                                            </div>
                                        </form>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                            {(() => {
                                                function onCreate() {
                                                    const values = form.getValues();

                                                    fetch("http://localhost:8080/api/v1/create-app", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            name: values.name,
                                                            repositoryUrl: values.repository,
                                                            type: values.type,
                                                        }),
                                                    })
                                                        .then(success => {
                                                            alert("cool");
                                                            setIsModalOpen(false);
                                                            apps.reload();
                                                        }, error => {
                                                            alert("error");
                                                        });
                                                }

                                                return (
                                                    <>
                                                        <Button onClick={onCreate}>Create</Button>
                                                        <WithDocumentEvent type="keypress">
                                                            {(event) => {
                                                                if (event.code === "Enter") {
                                                                    onCreate();
                                                                }
                                                            }}
                                                        </WithDocumentEvent>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </>
                                );
                            }}
                        </WithLifecycle>
                    </div>
                </div>
            )}
            <div className="m-4 p-4 rounded-xl border-0">
                <nav>
                    <ul>
                        <li>Apps</li>
                    </ul>
                </nav>
            </div>
            <div className="m-4 p-4 rounded-xl border-0">
                {apps?.data?.map?.(app => {
                    const name = app.Names[0].replace('/', '');
                    const url = (`http://${app.Names[0].replace('/', '')}.nulnow.com`) + (name === "java-app" ? ":8081" : "");

                    return (
                        <div key={app.Id} >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div>{name}</div>
                                    <div>
                                        <a className="text-blue-500 hover:text-blue-600" href={url} target={"_blank"}>{url}</a>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center gap-4">
                                    <Button className="bg-blue-300 hover:bg-blue-400" onClick={() => {
                                        fetch("http://localhost:8080/api/v1/delete/" + app.Id, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                        })
                                            .then(success => {
                                                apps.reload();
                                            }, error => {
                                                alert("error");
                                            })
                                            .then(() => {
                                                return fetch("http://localhost:8080/api/v1/create-app", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                        name: app.Names[0].replace("/", ""),
                                                        repositoryUrl: "https://github.com/nulnow/my-react-ts-app",
                                                        type: "react",
                                                    }),
                                                })
                                                    .then(success => {
                                                        apps.reload();
                                                    }, error => {
                                                        alert("error");
                                                    });
                                            });
                                    }}>Update</Button>

                                    <Button className="bg-red-300 hover:bg-red-400" onClick={() => {
                                        fetch("http://localhost:8080/api/v1/delete/" + app.Id, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                        })
                                            .then(success => {
                                                apps.reload();
                                            }, error => {
                                                alert("error");
                                            });
                                    }}>delete</Button>
                                </div>
                            </div>
                            <div>
                                <iframe className="border-2 rounded-xl mt-4" style={{ width: 800, height: 600, zoom: 0.5 }} src={url} frameborder="0"></iframe>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
